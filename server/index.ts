import express from 'express';
import cors from 'cors';
import path from 'path';
import { registerRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middleware';
import * as dotenv from 'dotenv';
import { setupAuth } from './auth';

// 環境変数のロード
dotenv.config();

// Expressアプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェアのセットアップ
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '..')));
// 明示的にtranslationsフォルダを静的ファイルとして提供
app.use('/translations', express.static(path.join(__dirname, '../translations')));

// 認証のセットアップはroutes.tsで行います

// APIルートの登録
const server = registerRoutes(app);

// エラーハンドラー
app.use(errorHandler);

// 404ハンドラー
app.use(notFoundHandler);

// サーバーの起動
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`サーバーが起動しました: http://0.0.0.0:${PORT}`);
});