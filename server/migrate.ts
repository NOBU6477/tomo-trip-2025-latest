import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as dotenv from 'dotenv';

// 環境変数のロード
dotenv.config();

// マイグレーション実行関数
async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL環境変数が設定されていません');
    process.exit(1);
  }

  console.log('データベース接続を開始します...');
  
  // データベース接続プールを作成
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('データベースに接続しました');
  
  const db = drizzle(pool);

  console.log('スキーマの作成を開始します...');
  
  try {
    // enumの型を作成
    await pool.query(`
      DO $$ 
      BEGIN 
        -- ユーザータイプのenum
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
          CREATE TYPE user_type AS ENUM ('tourist', 'guide');
        END IF;
        
        -- 予約ステータスのenum
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
          CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
        END IF;
      END $$;
    `);

    // テーブルの作成
    await pool.query(`
      -- ユーザーテーブル
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        type user_type NOT NULL DEFAULT 'tourist',
        profile_image TEXT,
        bio TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- ガイドプロフィールテーブル
      CREATE TABLE IF NOT EXISTS guide_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        specialties TEXT[],
        languages TEXT[],
        price_per_hour INTEGER,
        availability TEXT,
        city TEXT NOT NULL,
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- 予約テーブル
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        tourist_id INTEGER NOT NULL REFERENCES users(id),
        guide_id INTEGER NOT NULL REFERENCES users(id),
        date TIMESTAMP NOT NULL,
        duration INTEGER NOT NULL,
        location TEXT NOT NULL,
        notes TEXT,
        status booking_status NOT NULL DEFAULT 'pending',
        total_price INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- レビューテーブル
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(id),
        reviewer_id INTEGER NOT NULL REFERENCES users(id),
        reviewed_id INTEGER NOT NULL REFERENCES users(id),
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('データベーススキーマが正常に作成されました');
  } catch (error) {
    console.error('スキーマ作成中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('データベース接続を終了しました');
  }
}

// マイグレーションを実行
runMigration()
  .then(() => {
    console.log('マイグレーションが成功しました');
    process.exit(0);
  })
  .catch((err) => {
    console.error('マイグレーション中にエラーが発生しました:', err);
    process.exit(1);
  });