import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inspeccionesRouter from '../src/routes/inspecciones';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes - mount under /api to match frontend calls
app.use('/api', inspeccionesRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vercel handler
export default app;
