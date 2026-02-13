import { Pool } from 'pg';

// Declaramos una variable global para evitar múltiples instancias en desarrollo
const globalForPg = global as unknown as { pool: Pool };

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Configuraciones Enterprise:
    max: 20,              // Máximo de conexiones simultáneas
    idleTimeoutMillis: 30000, // Tiempo para cerrar conexiones inactivas
    connectionTimeoutMillis: 2000, // Tiempo límite para conectar
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;

export default pool;

