import mysql from 'mysql2/promise';

const required = ['DB_HOST','DB_USER','DB_PASSWORD','DB_NAME'] as const;
function config() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing database environment variables: ${missing.join(', ')}`);
  return { host: process.env.DB_HOST!, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER!, password: process.env.DB_PASSWORD!, database: process.env.DB_NAME!, waitForConnections: true, connectionLimit: 2, maxIdle: 1, idleTimeout: 60000, enableKeepAlive: true, connectTimeout: 15000, queueLimit: 0, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined };
}
// Lazily initialized so builds do not require production database credentials.
let pool: mysql.Pool | undefined;
export function db() { return pool ??= mysql.createPool(config()); }
export async function query<T>(sql: string, values: unknown[] = []): Promise<T[]> {
  const [rows] = await db().execute(sql, values as any[]);
  return rows as T[];
}
