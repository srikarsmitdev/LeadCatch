import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

// Helper to convert SQLite '?' placeholders to PostgreSQL '$1, $2, ...'
const convertParams = (query: string): string => {
  let pgQuery = query;
  let i = 1;

  while (pgQuery.includes('?')) {
    pgQuery = pgQuery.replace('?', `$${i}`);
    i++;
  }

  return pgQuery;
};

export const dbRun = async (
  query: string,
  params: any[] = []
): Promise<{ lastID: number; changes: number }> => {
  const result = await pool.query(convertParams(query), params);

  return {
    // For INSERT statements, add "RETURNING id" to retrieve the inserted ID.
    lastID: result.rows[0]?.id || 0,
    changes: result.rowCount || 0,
  };
};

export const dbGet = async (
  query: string,
  params: any[] = []
) => {
  const result = await pool.query(convertParams(query), params);
  return result.rows[0];
};

export const dbAll = async (
  query: string,
  params: any[] = []
) => {
  const result = await pool.query(convertParams(query), params);
  return result.rows;
};

export const initDb = async () => {
  // SQLite → PostgreSQL conversions:
  // 1. AUTOINCREMENT → SERIAL
  // 2. DATETIME → TIMESTAMP
  // 3. camelCase column names require double quotes

  await dbRun(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      budget INTEGER NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'new',
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      "leadId" INTEGER,
      read INTEGER DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `);
};