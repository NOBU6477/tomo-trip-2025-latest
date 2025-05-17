// 最もシンプルなHTTPサーバー
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

// MIMEタイプのマッピング
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// HTTPサーバーの作成
const server = http.createServer((req, res) => {
  console.log(`リクエスト: ${req.url}`);
  
  // URLからファイルパスを取得
  let filePath;
  if (req.url === '/' || req.url === '') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    filePath = path.join(__dirname, req.url);
  }
  
  // ファイル拡張子の取得
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // ファイルの読み込み
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // ファイルが見つからない場合はindex.htmlを返す
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // その他のエラー
        res.writeHead(500);
        res.end(`サーバーエラー: ${error.code}`);
      }
    } else {
      // 成功時
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// サーバーの起動
server.listen(PORT, '0.0.0.0', () => {
  console.log(`サーバーが起動しました: http://0.0.0.0:${PORT}`);
});