#!/usr/bin/env python3
"""
TomoTrip Local Guide - Deployment Ready Server
"""
import http.server
import socketserver
import os
import sys
from pathlib import Path

# デプロイメント対応ポート設定
PORT = int(os.environ.get('PORT', 5000))

class TomoTripHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # 現在のディレクトリを明示的に指定
        super().__init__(*args, directory=str(Path.cwd()), **kwargs)
    
    def end_headers(self):
        # デプロイメント用ヘッダー設定
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    
    def do_GET(self):
        # ルートアクセス時にindex.htmlを返す
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()
    
    def log_message(self, format, *args):
        # デプロイメント用ログ形式
        print(f"[TomoTrip] {format % args}", file=sys.stdout)

def main():
    """メインサーバー関数"""
    try:
        # TCPサーバー作成（デプロイメント対応）
        with socketserver.TCPServer(("", PORT), TomoTripHandler) as httpd:
            print(f"🏝️ TomoTrip Local Guide Server")
            print(f"📍 Port: {PORT}")
            print(f"🌐 Ready for deployment")
            print("=" * 40)
            
            # サーバー開始
            httpd.serve_forever()
            
    except Exception as e:
        print(f"❌ Server Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()