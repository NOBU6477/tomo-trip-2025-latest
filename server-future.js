/**
 * 将来的なNode.jsサーバー実装
 * Express 4.xベースの安定版サーバー
 * 
 * このファイルはすぐには使用せず、将来の移行のために用意しています
 */

// 必要なモジュールのインポート
const express = require('express');
const path = require('path');
const cors = require('cors');
const { config } = require('dotenv');

// 環境変数のロード
config();

// Expressアプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '/')));
app.use('/translations', express.static(path.join(__dirname, '/translations')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// APIエンドポイント
// ここにAPIルートを追加

/**
 * 例: 簡単なAPIエンドポイント
 * 
 * app.get('/api/status', (req, res) => {
 *   res.json({ status: 'ok', message: 'APIサーバーは正常に動作しています' });
 * });
 */

// SPAのためのルートハンドラー（すべての不明なルートをindex.htmlにリダイレクト）
app.get('*', (req, res) => {
  // /api/で始まるルートは除外 - APIエンドポイントを追加する場合
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'APIエンドポイントが見つかりません' });
  }
  
  res.sendFile(path.join(__dirname, 'index.html'));
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

// サーバーの起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`サーバーが起動しました: http://0.0.0.0:${PORT}`);
});