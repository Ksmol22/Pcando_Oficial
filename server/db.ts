import 'dotenv/config';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from "pg";
import * as schema from "@shared/schema";

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// PostgreSQL configuration
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export { pool };