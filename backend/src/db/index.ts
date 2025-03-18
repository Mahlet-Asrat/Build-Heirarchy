import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema  from './schema';

const pool = new Pool({
  connectionString: process.env.DB_URL!,
  ssl: process.env.DATABASE_SSL === 'true' ? {rejectUnauthorized: false} : false,
  // connectionTimeoutMillis: 5000,

});

export const db = drizzle(pool, { schema });

