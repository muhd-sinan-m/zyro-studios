import { Pool, PoolClient, QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL || "";

// Cache the pool globally across hot reloads and serverless invocations to prevent connection leaks
const globalForPg = globalThis as unknown as {
  postgresPool?: Pool;
};

export const pool: Pool =
  globalForPg.postgresPool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.postgresPool = pool;
}

/**
 * High-performance single query execution with automatic checkout and release
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === "development" && duration > 200) {
    console.warn(`[Slow Query ${duration}ms]: ${text.trim().slice(0, 100)}`);
  }
  return res.rows;
}

/**
 * Execute multiple database operations inside a single atomic ACID transaction.
 * Automatically executes BEGIN, COMMIT, and ROLLBACK on error.
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Batch insert multiple rows into a table in a single multi-row SQL query.
 * Eliminates N+1 INSERT overhead.
 */
export async function batchInsert<T extends Record<string, any>>(
  table: string,
  rows: T[]
): Promise<number> {
  if (!rows || rows.length === 0) return 0;

  // Strict table identifier validation to eliminate SQL injection risks
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)?$/.test(table)) {
    throw new Error(`[SECURITY] Invalid table name supplied to batchInsert: "${table}"`);
  }

  const columns = Object.keys(rows[0]);
  columns.forEach((col) => {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col)) {
      throw new Error(`[SECURITY] Invalid column identifier supplied to batchInsert: "${col}"`);
    }
  });

  const safeColumns = columns.map((col) => `"${col}"`);
  const values: any[] = [];
  const valueClauses: string[] = [];

  rows.forEach((row) => {
    const rowParams: string[] = [];
    columns.forEach((col) => {
      values.push(row[col]);
      rowParams.push(`$${values.length}`);
    });
    valueClauses.push(`(${rowParams.join(", ")})`);
  });

  const sql = `INSERT INTO ${table} (${safeColumns.join(", ")}) VALUES ${valueClauses.join(", ")}`;
  const res = await pool.query(sql, values);
  return res.rowCount || 0;
}
