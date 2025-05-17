/**
 * デプロイ用スクリプト
 * このスクリプトはReplitデプロイ環境で実行され、
 * Node.jsサーバーを適切に起動します。
 */

const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 5000;

// 実行中のPythonプロセスを停止（競合防止）
exec('pkill -f "python -m http.server"', (error, stdout, stderr) => {
  if (error) {
    console.log(`Pythonプロセス停止時のエラー (無視可): ${error.message}`);
    return;
  }
  if (stdout) console.log(`Pythonプロセス停止出力: ${stdout}`);
  if (stderr) console.log(`Pythonプロセス停止エラー出力: ${stderr}`);
});

// ポート解放の確認（8000, 8080）
const checkAndKillPort = (port) => {
  exec(`lsof -i:${port} -t`, (error, stdout, stderr) => {
    if (stdout) {
      const pid = stdout.trim();
      if (pid) {
        console.log(`ポート ${port} を使用しているPID ${pid} を停止します`);
        exec(`kill -9 ${pid}`);
      }
    }
  });
};

checkAndKillPort(8000);
checkAndKillPort(8080);
checkAndKillPort(5000);

// 静的ファイル配信の設定
console.log('==========================================');
console.log('Starting server...');
console.log('Setting up static file serving...');

// index.htmlの存在を確認
const indexPath = path.join(__dirname, 'index.html');
const fs = require('fs');
if (fs.existsSync(indexPath)) {
  console.log(`index.html found at ${indexPath}`);
} else {
  console.log(`WARNING: index.html not found at ${indexPath}`);
}

// 静的ファイルのルートディレクトリを設定
app.use(express.static(__dirname));

// すべてのルートへのリクエストをindex.htmlにリダイレクト（SPAサポート）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Server address info: ${JSON.stringify(server.address())}`);
  console.log('Server ready for deployment');
});