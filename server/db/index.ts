import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

// データベース接続プールを作成
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// drizzleインスタンスを作成
export const db = drizzle(pool);
