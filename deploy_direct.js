#!/usr/bin/env node
/**
 * TomoTrip Direct Deploy System
 * Replit環境での直接デプロイメント対応
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// 静的ファイル配信
const serveStatic = (req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // ルートアクセス処理
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  const filePath = path.join(__dirname, pathname);
  
  // ファイル存在確認
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 404エラーページ
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <title>TomoTrip - ページが見つかりません</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0; padding: 0; min-height: 100vh;
              display: flex; align-items: center; justify-content: center;
            }
            .container {
              background: white; padding: 40px; border-radius: 20px;
              text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              max-width: 500px; margin: 20px;
            }
            h1 { color: #007bff; margin-bottom: 20px; }
            .logo { font-size: 3em; margin-bottom: 20px; }
            a { 
              display: inline-block; background: #007bff; color: white;
              padding: 12px 30px; border-radius: 25px; text-decoration: none;
              font-weight: bold; margin-top: 20px;
            }
            a:hover { background: #0056b3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🏝️</div>
            <h1>TomoTrip</h1>
            <h2>ページが見つかりません</h2>
            <p>お探しのページは存在しないか移動された可能性があります。</p>
            <a href="/">🏠 トップページに戻る</a>
          </div>
        </body>
        </html>
      `);
      return;
    }
    
    // MIMEタイプ判定
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.json': 'application/json; charset=utf-8'
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // レスポンスヘッダー設定
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block'
    });
    
    res.end(data);
  });
};

// サーバー作成
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.headers['user-agent'] || 'Unknown'}`);
  
  // CORS対応
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }
  
  serveStatic(req, res);
});

// サーバー起動
server.listen(PORT, HOST, () => {
  console.log('='.repeat(70));
  console.log('🏝️  TomoTrip Local Guide - Direct Deploy Server');
  console.log('='.repeat(70));
  console.log(`📍 Server: http://${HOST}:${PORT}`);
  console.log(`🌐 External Access: ENABLED`);
  console.log(`⚡ Direct Deploy Mode: ACTIVE`);
  console.log(`🔐 Security: ENABLED`);
  console.log(`🚀 CORS: FULL SUPPORT`);
  console.log('='.repeat(70));
  console.log(`✅ Server started: ${new Date().toLocaleString('ja-JP')}`);
  console.log('   Ready for external connections');
  console.log('='.repeat(70));
});

// エラーハンドリング
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log(`🔄 Port ${PORT} is busy. Trying to restart...`);
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  console.log('\n🛑 Server shutdown requested...');
  server.close(() => {
    console.log('✅ TomoTrip Server stopped gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Server shutdown requested...');
  server.close(() => {
    console.log('✅ TomoTrip Server stopped gracefully');
    process.exit(0);
  });
});