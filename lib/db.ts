import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'energy_savings',
  password: 'postgres',
  port: 5432,
});

export default pool; 