/**
 * 直接実行デプロイスクリプト - より確実な方法
 * Python HTTP.serverとの競合を解決するためのスクリプト
 * Replitのデプロイ設定で以下を指定します：node deploy_direct.js
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// 実行中のPythonプロセスを強制終了
function killPythonServer() {
  // Windows環境も考慮（主にReplitはLinuxだが）
  const isWin = process.platform === "win32";
  const killCmd = isWin ? 
    'taskkill /F /IM python.exe /FI "WINDOWTITLE eq http.server"' : 
    'pkill -f "python -m http.server"';
  
  console.log(`[${new Date().toISOString()}] Pythonサーバープロセスを停止します...`);
  exec(killCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`[${new Date().toISOString()}] 実行中のPythonサーバーは見つかりませんでした`);
    } else {
      console.log(`[${new Date().toISOString()}] Pythonサーバーを停止しました: ${stdout}`);
    }
  });
  
  // ポート8000を使用しているプロセスを確認
  const portCheckCmd = isWin ? 
    'netstat -ano | findstr :8000' : 
    'lsof -i:8000 -t';
  
  exec(portCheckCmd, (error, stdout, stderr) => {
    if (!error && stdout) {
      console.log(`[${new Date().toISOString()}] ポート8000を使用中のプロセス: ${stdout}`);
      
      // プロセスを強制終了（PIDを抽出）
      const pids = stdout.trim().split('\n');
      pids.forEach(pid => {
        const cleanPid = pid.trim();
        if (cleanPid) {
          const killPidCmd = isWin ? `taskkill /F /PID ${cleanPid}` : `kill -9 ${cleanPid}`;
          exec(killPidCmd);
          console.log(`[${new Date().toISOString()}] プロセスを強制終了: ${cleanPid}`);
        }
      });
    }
  });
}

// サーバー起動前に競合解消
killPythonServer();

// Expressアプリケーション
const app = express();
const PORT = process.env.PORT || 5000;

// 静的ファイル配信
app.use(express.static(path.join(__dirname)));

// Replit Healthエンドポイント
app.get('/.replit/health', (req, res) => {
  res.status(200).send('OK');
});

// すべてのルートをindex.htmlにリダイレクト（SPA対応）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] ==========================================`);
  console.log(`[${new Date().toISOString()}] Starting server...`);
  console.log(`[${new Date().toISOString()}] Setting up static file serving...`);
  
  // index.htmlが存在するか確認（デバッグ用）
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log(`[${new Date().toISOString()}] index.html found at ${indexPath}`);
  } else {
    console.log(`[${new Date().toISOString()}] WARNING: index.html not found at ${indexPath}`);
  }
  
  console.log(`[${new Date().toISOString()}] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[${new Date().toISOString()}] Server address info: ${JSON.stringify(app.address ? app.address() : {"address":"0.0.0.0","family":"IPv4","port":PORT})}`);
  console.log(`[${new Date().toISOString()}] Server ready for deployment`);
  
  // システム情報（デバッグ用）
  exec('uname -a', (error, stdout, stderr) => {
    if (!error) {
      console.log(`[${new Date().toISOString()}] System info: ${stdout.trim()}`);
    }
  });
  
  // 実行中のプロセス（デバッグ用）
  exec('ps aux | grep python', (error, stdout, stderr) => {
    if (!error) {
      console.log(`[${new Date().toISOString()}] Running Python processes:\n${stdout}`);
    }
  });
});