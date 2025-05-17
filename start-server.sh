#!/bin/bash

# ログ関数
log() {
  echo "[$(date -Iseconds)] $1"
}

log "サーバー起動スクリプトを実行しています..."

# Pythonインターセプターをセットアップ
log "Pythonインターセプターを設定しています..."
if [ ! -f "bin/python" ]; then
  log "Pythonインターセプターをセットアップします..."
  bash ./setup-python-interceptor.sh
else
  log "Pythonインターセプターは既にセットアップされています"
fi

# Pythonコマンドを上書きして競合を防止
log "Pythonサーバー競合防止設定を適用しています..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="${SCRIPT_DIR}/bin:$PATH"
log "PATH環境変数を更新しました: $PATH"

# デプロイ環境フラグを設定
export REPLIT_DEPLOYMENT=true
log "デプロイ環境フラグを設定しました: REPLIT_DEPLOYMENT=$REPLIT_DEPLOYMENT"

# 1. 実行中の可能性のあるPythonサーバープロセスを停止
log "既存のPythonサーバープロセスを探しています..."
python_pids=$(ps aux | grep "python -m http.server" | grep -v grep | awk '{print $2}')

if [ -n "$python_pids" ]; then
  log "Pythonサーバープロセスを停止します: $python_pids"
  kill -9 $python_pids 2>/dev/null
else
  log "実行中のPythonサーバープロセスは見つかりませんでした"
fi

# 2. ポート8000、8080が使用中かチェック
log "ポート8000と8080の使用状況を確認しています..."
port_8000=$(lsof -i:8000 -t 2>/dev/null)
port_8080=$(lsof -i:8080 -t 2>/dev/null)

if [ -n "$port_8000" ]; then
  log "ポート8000を使用しているプロセスを停止します: $port_8000"
  kill -9 $port_8000 2>/dev/null
fi

if [ -n "$port_8080" ]; then
  log "ポート8080を使用しているプロセスを停止します: $port_8080"
  kill -9 $port_8080 2>/dev/null
fi

# 3. ポート5000が使用中かチェック（Node.jsサーバーを起動する前に確認）
log "ポート5000の使用状況を確認しています..."
port_5000=$(lsof -i:5000 -t 2>/dev/null)

if [ -n "$port_5000" ]; then
  log "ポート5000を使用しているプロセスを停止します: $port_5000"
  kill -9 $port_5000 2>/dev/null
fi

# 4. Node.jsサーバーを起動
log "Node.jsサーバーを起動しています..."
exec node index.js