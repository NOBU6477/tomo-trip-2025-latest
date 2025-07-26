#!/usr/bin/env python3
"""
TomoTrip - External Access Guaranteed Server
Replit Deployments回避版
"""
import http.server
import socketserver
import os
import threading
import time
from pathlib import Path

PORT = int(os.environ.get('PORT', 5000))

class ExternalAccessHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(Path.cwd()), **kwargs)
    
    def end_headers(self):
        # 最強の外部アクセスヘッダー
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Frame-Options', 'ALLOWALL')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'TomoTrip Server OK')
            return
        super().do_GET()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

class ForceExternalTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True
    
    def __init__(self, server_address, RequestHandlerClass):
        super().__init__(server_address, RequestHandlerClass)
        # ソケット設定強化
        self.socket.setsockopt(socketserver.socket.SOL_SOCKET, socketserver.socket.SO_REUSEADDR, 1)
        if hasattr(socketserver.socket, 'SO_REUSEPORT'):
            self.socket.setsockopt(socketserver.socket.SOL_SOCKET, socketserver.socket.SO_REUSEPORT, 1)

def status_monitor():
    """サーバー状態監視"""
    while True:
        try:
            import urllib.request
            with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/health', timeout=2) as response:
                if response.status == 200:
                    print(f"[Monitor] Server healthy at {time.strftime('%H:%M:%S')}")
        except:
            print(f"[Monitor] Health check failed at {time.strftime('%H:%M:%S')}")
        time.sleep(30)

def main():
    try:
        # マルチスレッドサーバー作成
        server = ForceExternalTCPServer(("0.0.0.0", PORT), ExternalAccessHandler)
        
        print("=" * 50)
        print("🏝️ TomoTrip External Access Server")
        print("=" * 50)
        print(f"📍 Port: {PORT}")
        print(f"🌐 Host: 0.0.0.0 (ALL INTERFACES)")  
        print(f"🔓 External Access: FORCE ENABLED")
        print(f"🧵 Threading: ENABLED")
        print(f"⚡ Status: READY")
        print("=" * 50)
        
        # 状態監視スレッド開始
        monitor_thread = threading.Thread(target=status_monitor, daemon=True)
        monitor_thread.start()
        
        # サーバー開始
        server.serve_forever()
        
    except Exception as e:
        print(f"❌ Server Error: {e}")
        raise

if __name__ == "__main__":
    main()