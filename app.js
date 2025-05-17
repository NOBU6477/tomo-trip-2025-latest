// シンプルなExpressサーバー - モバイル確認用
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// 静的ファイルの提供
app.use(express.static(path.join(__dirname)));

// ルートアクセス
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`アプリが起動しました: http://0.0.0.0:${PORT}`);
  console.log('モバイル閲覧の場合、エラー表示が抑止されていることを確認してください');
});