import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the DATABASE_URL from environment, but don't throw if it's missing
const databaseUrl = process.env.DATABASE_URL;

let pool: Pool | null = null;
let db: any = null;

if (databaseUrl) {
  try {
    pool = new Pool({ connectionString: databaseUrl });
    db = drizzle({ client: pool, schema });
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.warn('Failed to connect to PostgreSQL, will use in-memory storage:', error);
    pool = null;
    db = null;
  }
} else {
  console.log('No DATABASE_URL found, using in-memory storage for development');
}

export { pool, db };