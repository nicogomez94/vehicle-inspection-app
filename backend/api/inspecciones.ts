import { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePost, handleGetById, handleGetAll } from '../src/routes/inspecciones';

// Helper function to add CORS headers
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// Helper function to parse request body
async function parseBody(req: VercelRequest): Promise<any> {
  if (req.body) return req.body;
  
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Main serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(200).end();
  }

  // Add CORS headers to all responses
  setCorsHeaders(res);

  try {
    // Parse URL to extract path and ID
    const url = new URL(req.url || '', `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Remove 'api' and 'inspecciones' from path if present
    const relevantPath = pathParts.filter(p => p !== 'api' && p !== 'inspecciones');
    const id = relevantPath[0];

    // Parse body for POST requests
    const body = req.method === 'POST' ? await parseBody(req) : undefined;

    // Create a wrapper for handlers to work with Vercel's response object
    const wrappedRes = {
      status: (code: number) => {
        res.status(code);
        return wrappedRes;
      },
      json: (data: any) => {
        res.json(data);
      }
    };

    // Route the request
    if (req.method === 'POST') {
      // POST /api/inspecciones
      await handlePost({ body, query: req.query }, wrappedRes);
    } else if (req.method === 'GET' && id) {
      // GET /api/inspecciones/:id
      await handleGetById({ params: { id }, query: req.query }, wrappedRes);
    } else if (req.method === 'GET') {
      // GET /api/inspecciones
      await handleGetAll({ query: req.query }, wrappedRes);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
