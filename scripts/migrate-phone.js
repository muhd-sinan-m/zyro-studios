const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Parse .env.local manually
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
  console.error("Error: DATABASE_URL not found.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

async function migratePhone() {
  const client = await pool.connect();
  try {
    console.log("Connecting to PostgreSQL DB...");

    // 1. Add phone column
    await client.query(`ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS phone TEXT;`);
    console.log("✓ Added 'phone' column to public.inquiries table.");

    // 2. Backfill existing inquiries
    const phones = [
      "+91 98765 43210",
      "+1 (555) 234-5678",
      "+44 7911 987654",
      "+971 50 123 4567",
      "+65 9123 4567",
    ];

    const { rows } = await client.query(`SELECT id, name FROM public.inquiries WHERE phone IS NULL OR phone = '';`);
    console.log(`Found ${rows.length} inquiries needing phone backfill.`);

    for (let i = 0; i < rows.length; i++) {
      const randomPhone = phones[i % phones.length];
      await client.query(`UPDATE public.inquiries SET phone = $1 WHERE id = $2;`, [randomPhone, rows[i].id]);
      console.log(`✓ Backfilled ${rows[i].name} with phone: ${randomPhone}`);
    }

    console.log("✓ Migration and backfill completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migratePhone();
