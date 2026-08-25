const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is required.");
  process.exit(1);
}

console.log("Connecting to PostgreSQL Supabase database via DATABASE_URL...");

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("✅ Successfully connected to Supabase PostgreSQL database!");

    console.log("Creating tables and extensions...");
    
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        short_description TEXT NOT NULL,
        full_description TEXT,
        technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
        features JSONB NOT NULL DEFAULT '[]'::jsonb,
        thumbnail_url TEXT,
        screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
        live_url TEXT,
        year INTEGER NOT NULL DEFAULT 2026,
        featured BOOLEAN NOT NULL DEFAULT false,
        status TEXT NOT NULL DEFAULT 'live',
        problem_statement TEXT,
        solution TEXT,
        results TEXT,
        client TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.inquiries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        project_type TEXT NOT NULL,
        timeline TEXT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        details TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread',
        notes TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'superadmin'
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
      CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
      CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
      CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
    `);

    console.log("✅ Schema migration executed successfully!");

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Active public tables in Supabase:", res.rows.map((r) => r.table_name));

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
