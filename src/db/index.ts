import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema.ts";

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const connectionString = process.env.DATABASE_URL;
    const isCloudHost =
      Boolean(
        connectionString &&
          !connectionString.includes("localhost") &&
          !connectionString.includes("127.0.0.1")
      ) ||
      Boolean(
        process.env.SQL_HOST &&
          process.env.SQL_HOST !== "localhost" &&
          process.env.SQL_HOST !== "127.0.0.1"
      );
    const useSsl =
      process.env.SQL_SSL === "true" ||
      isCloudHost ||
      process.env.NODE_ENV === "production";

    const poolConfig: PoolConfig = connectionString
      ? {
          connectionString,
          max: 10,
          connectionTimeoutMillis: 15000,
          ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
        }
      : {
          host: process.env.SQL_HOST || "127.0.0.1",
          port: Number(process.env.SQL_PORT) || 5432,
          user: process.env.SQL_USER || "postgres",
          password: process.env.SQL_PASSWORD,
          database: process.env.SQL_DB_NAME || "skillloop",
          max: 10,
          connectionTimeoutMillis: 15000,
          ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
        };

    global._postgresPool = new Pool(poolConfig);

    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
