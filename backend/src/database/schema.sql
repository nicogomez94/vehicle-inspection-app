CREATE TABLE IF NOT EXISTS inspecciones (
  id SERIAL PRIMARY KEY,
  owner_name TEXT NOT NULL,
  brand_model TEXT NOT NULL,
  plate TEXT NOT NULL,
  notes TEXT,
  photos TEXT[],
  signature TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
