const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env.local");
let dbUrl = process.env.DATABASE_URL;

if (!dbUrl && fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, "utf8");
  const match = envText.match(/DATABASE_URL="?([^"\n\r]+)"?/);
  if (match) {
    dbUrl = match[1];
  }
}

if (!dbUrl) {
  console.error("Error: DATABASE_URL not found in environment or .env.local.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

async function migrateHidden() {
  const client = await pool.connect();
  try {
    console.log("Connecting to PostgreSQL Supabase database...");

    // 1. Add is_hidden column to public.projects if it doesn't exist
    await client.query(`
      ALTER TABLE public.projects 
      ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT false;
    `);
    console.log("✓ Ensured 'is_hidden' column exists in public.projects table.");

    // 2. Create index on is_hidden
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_is_hidden ON public.projects(is_hidden);
    `);
    console.log("✓ Ensured index on 'is_hidden' exists.");

    const res = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'is_hidden';
    `);
    console.log("Verified column details:", res.rows);

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateHidden();
