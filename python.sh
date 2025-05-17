#!/bin/bash

# Python HTTPサーバー実行試行をインターセプトして代わりにNode.jsサーバーを起動
# このスクリプトはbinディレクトリにリンクされ、Pythonコマンドの置き換えとして機能します

# コマンドラインパラメータをログに記録
echo "[$(date -Iseconds)] [Python Interceptor] コマンド: $@"

# http.serverモジュールが引数に含まれているかチェック
if [[ "$*" == *"http.server"* ]]; then
  echo "[$(date -Iseconds)] [Python Interceptor] HTTPサーバー起動を検出しました。代わりにNode.jsサーバーを使用します。"
  
  # PID 1のプロセスがSystemdかどうかを確認（これにより環境を判定）
  if [ "$(ps -p 1 -o comm=)" = "systemd" ]; then
    echo "[$(date -Iseconds)] [Python Interceptor] 標準的なLinux環境を検出しました。"
    # バックグラウンドでNode.jsサーバーを起動
    nohup node deploy.js > node_server.log 2>&1 &
  else
    echo "[$(date -Iseconds)] [Python Interceptor] Replit環境を検出しました。特別な起動方法を使用します。"
    # Replitの環境では別の方法を使用
    NODE_PID=$(pgrep -f "node deploy.js" | head -n 1)
    if [ -z "$NODE_PID" ]; then
      echo "[$(date -Iseconds)] [Python Interceptor] Node.jsサーバーを起動します"
      nohup node deploy.js > node_server.log 2>&1 &
    else
      echo "[$(date -Iseconds)] [Python Interceptor] Node.jsサーバーは既に実行中です (PID: $NODE_PID)"
    fi
  fi
  
  # 成功を示す終了コード
  exit 0
else
  # 通常のPythonコマンドは実際のPythonインタープリターに渡す
  # ただし、このスクリプトがデプロイ環境で使用される場合は何もせず終了
  if [ -z "$REPLIT_DEPLOYMENT" ]; then
    echo "[$(date -Iseconds)] [Python Interceptor] 通常のPythonコマンドを実行します"
    /usr/bin/python3 "$@"
  else
    echo "[$(date -Iseconds)] [Python Interceptor] デプロイ環境でのPythonコマンドは無視されます"
    exit 0
  fi
fi