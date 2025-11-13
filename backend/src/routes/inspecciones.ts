import { Router, Request, Response } from 'express';
import pool from '../database/db';
import { Inspeccion, InspeccionDB } from '../types/inspeccion';

const router = Router();

// POST /api/inspecciones - Create new inspection
router.post('/inspecciones', async (req: Request, res: Response) => {
  try {
    const { ownerName, brandModel, plate, notes, photos, signature, createdAt }: Inspeccion = req.body;

    // Validate required fields
    if (!ownerName || !brandModel || !plate || !signature || !photos || photos.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields: ownerName, brandModel, plate, signature, and photos are required' 
      });
    }

    const query = `
      INSERT INTO inspecciones (owner_name, brand_model, plate, notes, photos, signature, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      ownerName,
      brandModel,
      plate,
      notes || null,
      photos,
      signature,
      createdAt || new Date().toISOString()
    ];

    const result = await pool.query<InspeccionDB>(query, values);
    const row = result.rows[0];

    // Convert snake_case to camelCase for response
    const response: Inspeccion = {
      id: row.id,
      ownerName: row.owner_name,
      brandModel: row.brand_model,
      plate: row.plate,
      notes: row.notes,
      photos: row.photos,
      signature: row.signature,
      createdAt: row.created_at.toISOString()
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating inspection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/inspecciones/:id - Get inspection by ID
router.get('/inspecciones/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid inspection ID' });
    }

    const query = 'SELECT * FROM inspecciones WHERE id = $1';
    const result = await pool.query<InspeccionDB>(query, [parseInt(id)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    const row = result.rows[0];

    // Convert snake_case to camelCase for response
    const response: Inspeccion = {
      id: row.id,
      ownerName: row.owner_name,
      brandModel: row.brand_model,
      plate: row.plate,
      notes: row.notes,
      photos: row.photos,
      signature: row.signature,
      createdAt: row.created_at.toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching inspection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
