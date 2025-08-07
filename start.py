#!/usr/bin/env python3
"""
TomoTrip - デプロイメント対応起動スクリプト
Production-ready server startup script for Replit deployment
"""

import os
import sys
import subprocess
import signal
import time
from pathlib import Path

def setup_environment():
    """環境設定とディレクトリ確認"""
    print("🔧 Environment setup...")
    
    # 現在のディレクトリ確認
    current_dir = Path.cwd()
    print(f"📁 Current directory: {current_dir}")
    
    # 必要ファイルの存在確認
    required_files = ['main.py', 'index.html', 'replit.toml']
    for file in required_files:
        if not Path(file).exists():
            print(f"❌ Required file missing: {file}")
            return False
        else:
            print(f"✅ Found: {file}")
    
    # 環境変数設定
    os.environ['PYTHONPATH'] = str(current_dir)
    os.environ['PORT'] = os.environ.get('PORT', '5000')
    
    print(f"🌐 PORT: {os.environ['PORT']}")
    print(f"🐍 PYTHONPATH: {os.environ['PYTHONPATH']}")
    
    return True

def cleanup_old_processes():
    """既存のプロセスをクリーンアップ"""
    try:
        print("🧹 Cleaning up old processes...")
        # ポート5000を使用しているプロセスを終了
        subprocess.run(['pkill', '-f', 'python.*main.py'], 
                      capture_output=True, timeout=5)
        subprocess.run(['pkill', '-f', 'python.*start.py'], 
                      capture_output=True, timeout=5)
        time.sleep(1)
        print("✅ Cleanup completed")
    except Exception as e:
        print(f"⚠️ Cleanup warning: {e}")

def start_server():
    """サーバー起動"""
    try:
        print("🚀 Starting TomoTrip server...")
        print("=" * 50)
        
        # main.pyを実行
        process = subprocess.Popen([
            sys.executable, 'main.py'
        ], 
        stdout=subprocess.PIPE, 
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1)
        
        # リアルタイムログ出力
        try:
            for line in process.stdout:
                print(line.rstrip())
                
                # サーバー起動確認
                if "Server起動" in line or "serve_forever" in line:
                    print("✅ Server startup confirmed")
                    
        except KeyboardInterrupt:
            print("\n🛑 Shutdown signal received")
            process.terminate()
            process.wait()
            
    except Exception as e:
        print(f"❌ Server startup failed: {e}")
        return False
        
    return True

def signal_handler(signum, frame):
    """シグナルハンドラー"""
    print(f"\n🛑 Signal {signum} received - shutting down gracefully")
    sys.exit(0)

def main():
    """メイン実行関数"""
    print("=" * 60)
    print("🌴 TomoTrip - Production Deployment Startup")
    print("=" * 60)
    
    # シグナルハンドラー設定
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    
    # 環境セットアップ
    if not setup_environment():
        print("❌ Environment setup failed")
        sys.exit(1)
    
    # 古いプロセスクリーンアップ
    cleanup_old_processes()
    
    # サーバー起動
    if not start_server():
        print("❌ Server startup failed")
        sys.exit(1)

if __name__ == "__main__":
    main()