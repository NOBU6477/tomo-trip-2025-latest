const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// 静的ファイル配信
app.use(express.static('.', {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// ルートアクセス
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ TomoTrip Local Guide サーバー起動: http://0.0.0.0:${PORT}`);
  console.log(`✓ 緊急修正システム対応: キャッシュ無効化`);
  console.log(`✓ 管理センター機能: 有効`);
});