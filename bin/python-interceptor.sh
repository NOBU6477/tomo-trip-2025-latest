#!/bin/bash

# Pythonサーバー競合防止用のインターセプタースクリプト
# このスクリプトは通常のpythonコマンドをインターセプトし、HTTPサーバーの起動を防止します

# コマンドラインパラメータをログに記録
echo "[Python Interceptor] Called with args: $@" >&2

# http.serverモジュールが引数に含まれているかチェック
if [[ "$*" == *"http.server"* ]]; then
  echo "[Python Interceptor] HTTPサーバー起動を検出しました。代わりにNode.jsサーバーを使用します。" >&2
  
  # Node.jsが実行中かチェック
  NODE_RUNNING=$(ps aux | grep "node" | grep -v "grep" | wc -l)
  
  if [ $NODE_RUNNING -eq 0 ]; then
    echo "[Python Interceptor] Node.jsサーバーを起動します" >&2
    # バックグラウンドでNode.jsサーバーを起動
    nohup node deploy.js > node_server.log 2>&1 &
    # 成功を示す終了コード
    exit 0
  else
    echo "[Python Interceptor] Node.jsサーバーは既に実行中です" >&2
    # 成功を示す終了コード
    exit 0
  fi
else
  # 通常のPythonコマンドは実際のPythonインタープリターに渡す
  echo "[Python Interceptor] 通常のPythonコマンドを実行します" >&2
  /usr/bin/python3 "$@"
fi