const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ポート設定
const PORT = process.env.PORT || 5000;

// MIMEタイプのマッピング
const MIME_TYPES = {
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
  '.txt': 'text/plain'
};

// ログ関数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}]`;
  
  switch (type) {
    case 'info':
      console.log(`${prefix} ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`);
      break;
    case 'error':
      console.error(`${prefix} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

// メインのHTTPサーバー
const server = http.createServer((req, res) => {
  // リクエストログ
  log(`${req.method} ${req.url}`);
  
  // URLのパスと検索パラメータを解析
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // URLパスに基づいてファイルパスを決定
  let filePath = '.' + pathname;
  
  // ルートパスの場合はindex.htmlを提供
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // ガイド詳細ページのリダイレクト処理（例：/guide-details.html?id=3など）
  if (pathname.startsWith('/guide-details.html') || pathname.match(/\/guide-details\/\d+/)) {
    filePath = './guide-details.html';
  }
  
  // 協賛店詳細ページのリダイレクト処理
  if (pathname.startsWith('/sponsor-detail.html')) {
    filePath = './sponsor-detail.html';
  }
  
  // その他の動的ルートを処理
  // 将来的に/find-guidesなどのパスを追加する場合はここで処理

  // ファイルの拡張子を取得
  const extname = path.extname(filePath).toLowerCase();
  
  // デフォルトのコンテンツタイプ
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // ファイルを読み込んでレスポンスを返す
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // ファイルが見つからない場合
      if (err.code === 'ENOENT') {
        // カスタム404ページがあればそれを使用、なければシンプルなメッセージ
        fs.readFile('./404.html', (err, content) => {
          if (err) {
            // 404ページが見つからない場合はシンプルなメッセージ
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1><p>The requested resource was not found on this server.</p>');
          } else {
            // カスタム404ページを表示
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content);
          }
        });
      } else {
        // その他のサーバーエラー
        log(`サーバーエラー: ${err.code}`, 'error');
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>Sorry, there was a problem on our end.</p>');
      }
    } else {
      // 成功
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// サーバー起動
server.listen(PORT, '0.0.0.0', () => {
  const serverInfo = server.address();
  log('==========================================');
  log('Starting server...');
  log('Setting up static file serving...');
  
  // index.htmlファイルの存在を確認
  if (fs.existsSync('./index.html')) {
    log(`index.html found at ${path.resolve('./index.html')}`);
  } else {
    log('Warning: index.html not found in current directory', 'warn');
  }
  
  log(`Server running on http://${serverInfo.address}:${serverInfo.port}`);
  log(`Server address info: ${JSON.stringify(serverInfo)}`);
  log('Server ready for deployment');
});

// エラーハンドリング
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`Error: Port ${PORT} is already in use.`, 'error');
    log('Please make sure the port is available and try again.', 'error');
  } else {
    log(`Server error: ${err.message}`, 'error');
  }
});

// プロセス終了時の処理
process.on('SIGINT', () => {
  log('Server shutting down...');
  server.close(() => {
    log('Server stopped');
    process.exit(0);
  });
});