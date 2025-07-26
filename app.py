#!/usr/bin/env python3
"""
TomoTrip Web Application - Replit外部アクセス対応版
"""

import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse
from datetime import datetime
import threading
import time

PORT = int(os.environ.get('PORT', 5000))

class ReplitHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)
    
    def end_headers(self):
        # Replit外部アクセス対応
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('X-Replit-External', 'true')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        # ルートアクセス処理
        if self.path == '/':
            self.path = '/index.html'
        
        # 健康チェック
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
            return
        
        super().do_GET()
    
    def log_message(self, format, *args):
        timestamp = datetime.now().strftime('%H:%M:%S')
        print(f"[{timestamp}] {format % args}")

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

def start_server():
    # ポート確認
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        result = s.connect_ex(('127.0.0.1', PORT))
        if result == 0:
            print(f"⚠️ Port {PORT} is in use. Attempting to free...")
            os.system(f"lsof -ti:{PORT} | xargs kill -9 2>/dev/null")
            time.sleep(2)
    
    try:
        with ThreadedTCPServer(("0.0.0.0", PORT), ReplitHandler) as httpd:
            print("=" * 60)
            print("🏝️ TomoTrip - Replit External Access Server")
            print("=" * 60)
            print(f"📍 Server: http://0.0.0.0:{PORT}")
            print(f"🌐 External Access: ENABLED")
            print(f"⚡ Replit Compatible: YES")
            print(f"🔧 Threading: ENABLED")
            print(f"🚀 Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("=" * 60)
            print("✅ Ready for connections")
            print("=" * 60)
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Port {PORT} still in use. Waiting and retrying...")
            time.sleep(5)
            start_server()
        else:
            raise e
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")

if __name__ == "__main__":
    start_server()