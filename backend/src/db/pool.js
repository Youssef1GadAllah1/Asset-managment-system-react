import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use DATABASE_URL if provided (Supabase), otherwise use individual config
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' 
        ? true 
        : { rejectUnauthorized: false }, // Allow self-signed certificates for development
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME || 'eva_ams',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
