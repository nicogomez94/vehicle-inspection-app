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
      // console.log('📋 Datos recibidos:', {
      //   ...dataWithoutPhotos,
      //   photos: photos ? `[${photos.length} fotos]` : '[]'
      // });
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

// GET /api/inspecciones - Get all inspections with filtering and sorting
router.get('/inspecciones', async (req: Request, res: Response) => {
  const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
  
  try {
    const { 
      search = '', 
      sortBy = 'created_at', 
      sortOrder = 'DESC',
      page = '1',
      limit = '10'
    } = req.query;

    if (DEBUG_MODE) console.log('🔍 Solicitud GET para listar inspecciones:', { search, sortBy, sortOrder, page, limit });

    // Validate sortBy to prevent SQL injection
    const validSortColumns = ['id', 'owner_name', 'brand_model', 'plate', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy as string) ? sortBy : 'created_at';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Build query with search filter
    let query = `
      SELECT * FROM inspecciones
      WHERE (
        LOWER(owner_name) LIKE LOWER($1) OR
        LOWER(brand_model) LIKE LOWER($1) OR
        LOWER(plate) LIKE LOWER($1) OR
        LOWER(notes) LIKE LOWER($1)
      )
      ORDER BY ${sortColumn} ${order}
      LIMIT $2 OFFSET $3
    `;

    const searchPattern = `%${search}%`;
    const result = await pool.query<InspeccionDB>(query, [searchPattern, limitNum, offset]);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) FROM inspecciones
      WHERE (
        LOWER(owner_name) LIKE LOWER($1) OR
        LOWER(brand_model) LIKE LOWER($1) OR
        LOWER(plate) LIKE LOWER($1) OR
        LOWER(notes) LIKE LOWER($1)
      )
    `;
    const countResult = await pool.query(countQuery, [searchPattern]);
    const totalCount = parseInt(countResult.rows[0].count);

    // Convert results
    const inspecciones = result.rows.map(row => ({
      id: row.id,
      ownerName: row.owner_name,
      brandModel: row.brand_model,
      plate: row.plate,
      notes: row.notes,
      photos: row.photos,
      signature: row.signature,
      createdAt: row.created_at.toISOString()
    }));

    if (DEBUG_MODE) console.log(`✅ Se encontraron ${inspecciones.length} inspecciones de ${totalCount} totales`);

    res.json({
      data: inspecciones,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching inspections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
