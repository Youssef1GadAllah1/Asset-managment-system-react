import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../../.env');

console.log('[v0] Pool.js - Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
console.log('[v0] Pool.js - .env loaded:', result.parsed ? 'YES' : 'NO');

// Log all database-related env vars
console.log('[v0] Pool.js - DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('[v0] Pool.js - SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');

if (process.env.DATABASE_URL) {
  console.log('[v0] Pool.js - DATABASE_URL preview:', process.env.DATABASE_URL.substring(0, 60) + '...');
}

// Disable certificate verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const dbUrl = process.env.DATABASE_URL;

let pool;

if (dbUrl && dbUrl.includes('supabase')) {
  console.log('[v0] Pool.js - Creating Supabase connection');
  pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
    max: 20,
    min: 2,
  });
} else if (dbUrl) {
  console.log('[v0] Pool.js - Creating standard PostgreSQL connection');
  pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
  });
} else {
  console.log('[v0] Pool.js - No DATABASE_URL, falling back to localhost');
  pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'eva_ams',
    user: 'postgres',
    password: 'postgres',
  });
}

pool.on('error', (err) => {
  console.error('[v0] Pool error:', err.message);
});

pool.on('connect', () => {
  console.log('[v0] Pool - Successfully connected to database');
});

export default pool;
