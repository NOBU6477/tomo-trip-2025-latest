const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;

// MIMEタイプ定義
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // CORS・キャッシュ無効化ヘッダー
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  let pathname = url.parse(req.url).pathname;
  
  // ルートアクセスをindex.htmlにリダイレクト
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  const filePath = path.join(__dirname, pathname.startsWith('/') ? pathname.slice(1) : pathname);
  const ext = path.extname(filePath).toLowerCase();
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`ファイル読み込みエラー: ${filePath}`, err.message);
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TomoTrip - ページが見つかりません</title>
          <style>
            body { font-family: 'Hiragino Sans', sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            h1 { color: #007bff; margin-bottom: 20px; }
            .logo { font-size: 2em; margin-bottom: 20px; }
            a { color: #007bff; text-decoration: none; font-weight: bold; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🏝️ TomoTrip</div>
            <h1>ページが見つかりません</h1>
            <p>お探しのページは存在しないか、移動された可能性があります。</p>
            <p><a href="/">トップページに戻る</a></p>
          </div>
        </body>
        </html>
      `);
      return;
    }
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': contentType + (contentType.startsWith('text/') ? '; charset=utf-8' : '')});
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log('🏝️ TomoTrip Local Guide サーバー起動完了');
  console.log(`📍 URL: http://0.0.0.0:${PORT}`);
  console.log(`🌐 外部アクセス: 完全対応`);
  console.log(`⚡ 本格運用モード: 有効`);
  console.log(`🔧 キャッシュ無効化: 強制適用`);
  console.log('='.repeat(60));
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  console.log('サーバーを正常終了します...');
  server.close(() => {
    console.log('✅ サーバー正常終了');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nサーバーを正常終了します...');
  server.close(() => {
    console.log('✅ サーバー正常終了');
    process.exit(0);
  });
});