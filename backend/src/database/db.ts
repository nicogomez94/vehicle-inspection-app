import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Optimización del pool de conexiones
  max: 20, // número máximo de clientes en el pool
  idleTimeoutMillis: 30000, // cerrar clientes inactivos después de 30 segundos
  connectionTimeoutMillis: 10000, // timeout para obtener una conexión
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Log de conexiones para debugging
pool.on('connect', () => {
  console.log('✅ Nueva conexión al pool de PostgreSQL');
});

export default pool;
