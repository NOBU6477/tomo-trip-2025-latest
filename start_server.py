#!/usr/bin/env python3
"""
TomoTrip Final Server - 確実な外部アクセス対応
"""

import http.server
import socketserver
import os
import signal
import sys
from datetime import datetime

PORT = int(os.environ.get('PORT', 5000))

class TomoTripHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)
    
    def end_headers(self):
        # 外部アクセス完全対応ヘッダー
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        super().do_GET()
    
    def log_message(self, format, *args):
        timestamp = datetime.now().strftime('%H:%M:%S')
        print(f"[{timestamp}] {format % args}")

class ReusePortTCPServer(socketserver.TCPServer):
    allow_reuse_address = True
    
    def server_bind(self):
        # ソケット再利用設定
        self.socket.setsockopt(socketserver.socket.SOL_SOCKET, socketserver.socket.SO_REUSEADDR, 1)
        if hasattr(socketserver.socket, 'SO_REUSEPORT'):
            self.socket.setsockopt(socketserver.socket.SOL_SOCKET, socketserver.socket.SO_REUSEPORT, 1)
        super().server_bind()

def cleanup_and_exit(signum, frame):
    print("\n🛑 サーバー正常終了")
    sys.exit(0)

def main():
    # シグナルハンドラー設定
    signal.signal(signal.SIGTERM, cleanup_and_exit)
    signal.signal(signal.SIGINT, cleanup_and_exit)
    
    try:
        with ReusePortTCPServer(("0.0.0.0", PORT), TomoTripHandler) as httpd:
            print("=" * 50)
            print("🏝️ TomoTrip Server - Final Version")
            print("=" * 50)
            print(f"📍 URL: http://0.0.0.0:{PORT}")
            print(f"🌐 外部アクセス: 完全対応")
            print(f"⚡ 起動: {datetime.now().strftime('%H:%M:%S')}")
            print(f"🔧 ポート再利用: 有効")
            print("=" * 50)
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:
            print(f"❌ ポート {PORT} 使用中。別ポートで試行...")
            # 代替ポートで試行
            for alt_port in [5001, 5002, 5003, 8000, 8080]:
                try:
                    with ReusePortTCPServer(("0.0.0.0", alt_port), TomoTripHandler) as httpd:
                        print(f"✅ 代替ポート {alt_port} で起動成功")
                        httpd.serve_forever()
                        break
                except:
                    continue
            else:
                print("❌ 利用可能なポートが見つかりません")
        else:
            print(f"❌ サーバーエラー: {e}")

if __name__ == "__main__":
    main()