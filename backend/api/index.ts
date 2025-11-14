import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inspeccionesRouter from '../src/routes/inspecciones';
import pool from '../src/database/db';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes - support both /api/* and /* to be robust with Vercel routing
app.use(['/api', '/'], inspeccionesRouter);

// Health check (both paths)
app.get(['/api/health', '/health'], async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW() as time, current_database() as db');
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        time: result.rows[0].time,
        dbName: result.rows[0].db,
        host: process.env.DB_HOST || process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : String(error),
        config: {
          hasDbHost: !!process.env.DB_HOST,
          hasDbUrl: !!process.env.DATABASE_URL,
          dbName: process.env.DB_NAME || 'not set'
        }
      }
    });
  }
});

// Vercel handler
export default app;
