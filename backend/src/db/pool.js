import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });

console.log('[v0] Loading .env from:', envPath);
console.log('[v0] .env loaded:', result.parsed ? 'Success' : 'Failed');
console.log('[v0] DATABASE_URL set:', !!process.env.DATABASE_URL);

// Disable certificate verification for development (Supabase uses self-signed certificates)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const dbUrl = process.env.DATABASE_URL;
console.log('[v0] Using database URL:', dbUrl ? dbUrl.substring(0, 50) + '...' : 'NOT SET');

// Always use DATABASE_URL if it exists
let pool;
if (dbUrl) {
  console.log('[v0] Creating pool with DATABASE_URL');
  pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });
} else {
  console.log('[v0] Creating pool with localhost config');
  pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'eva_ams',
    user: 'postgres',
    password: 'postgres',
  });
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
