import { Pool } from 'pg'; 

const globalForPg = global as unknown as { pool: Pool };

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,              
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;

export default pool;

