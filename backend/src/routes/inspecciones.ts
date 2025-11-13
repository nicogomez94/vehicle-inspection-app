import { Router, Request, Response } from 'express';
import pool from '../database/db';
import { Inspeccion, InspeccionDB } from '../types/inspeccion';

const router = Router();

// POST /api/inspecciones - Create new inspection
router.post('/inspecciones', async (req: Request, res: Response) => {
  const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
  
  try {
    console.log('📥 Nueva solicitud de inspección recibida');
    
    if (DEBUG_MODE) {
      const { photos, ...dataWithoutPhotos } = req.body;
      console.log('📋 Datos recibidos:', {
        ...dataWithoutPhotos,
        photos: photos ? `[${photos.length} fotos]` : '[]'
      });
    }
    
    const { ownerName, brandModel, plate, notes, photos, signature, createdAt }: Inspeccion = req.body;

    // Validate required fields
    if (!ownerName || !brandModel || !plate || !signature || !photos || photos.length === 0) {
      if (DEBUG_MODE) console.log('❌ Validación fallida: campos requeridos faltantes');
      return res.status(400).json({ 
        error: 'Missing required fields: ownerName, brandModel, plate, signature, and photos are required' 
      });
    }
    
    if (DEBUG_MODE) console.log('✅ Validación exitosa, insertando en base de datos...');

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
    
    console.log('💾 Inspección guardada exitosamente con ID:', row.id);

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
    
    if (DEBUG_MODE) console.log('✅ Respuesta enviada al cliente con ID:', response.id);

    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Error creating inspection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/inspecciones/:id - Get inspection by ID
router.get('/inspecciones/:id', async (req: Request, res: Response) => {
  const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
  
  try {
    if (DEBUG_MODE) console.log('🔍 Solicitud GET recibida para inspección ID:', req.params.id);
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      if (DEBUG_MODE) console.log('❌ ID inválido proporcionado:', id);
      return res.status(400).json({ error: 'Invalid inspection ID' });
    }

    const query = 'SELECT * FROM inspecciones WHERE id = $1';
    const result = await pool.query<InspeccionDB>(query, [parseInt(id)]);

    if (result.rows.length === 0) {
      if (DEBUG_MODE) console.log('❌ Inspección no encontrada con ID:', id);
      return res.status(404).json({ error: 'Inspection not found' });
    }

    const row = result.rows[0];
    if (DEBUG_MODE) console.log('✅ Inspección encontrada:', row.id);

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
