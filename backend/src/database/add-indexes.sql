-- Índices para optimizar búsquedas y ordenamiento en la tabla inspecciones
-- Ejecutar este script una sola vez en la base de datos de producción

-- Índice para búsquedas por owner_name (texto)
CREATE INDEX IF NOT EXISTS idx_inspecciones_owner_name ON inspecciones USING gin(to_tsvector('spanish', owner_name));

-- Índice para búsquedas por brand_model (texto)
CREATE INDEX IF NOT EXISTS idx_inspecciones_brand_model ON inspecciones USING gin(to_tsvector('spanish', brand_model));

-- Índice para búsquedas por plate (exacto y pattern matching)
CREATE INDEX IF NOT EXISTS idx_inspecciones_plate ON inspecciones(plate);
CREATE INDEX IF NOT EXISTS idx_inspecciones_plate_lower ON inspecciones(LOWER(plate));

-- Índice para ordenamiento por fecha (más común)
CREATE INDEX IF NOT EXISTS idx_inspecciones_created_at ON inspecciones(created_at DESC);

-- Índice compuesto para búsquedas + ordenamiento
CREATE INDEX IF NOT EXISTS idx_inspecciones_search ON inspecciones(created_at DESC, owner_name, brand_model, plate);

-- Verificar índices creados
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'inspecciones'
ORDER BY indexname;
