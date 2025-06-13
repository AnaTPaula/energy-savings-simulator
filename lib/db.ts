import { Pool } from 'pg';

const pool = new Pool(
  process.env.NODE_ENV === 'production'
    ? {
        connectionString: process.env.POSTGRES_URL,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: parseInt(process.env.PGPORT || '5432', 10),
      }
);

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL:', err);
});

export default pool; 