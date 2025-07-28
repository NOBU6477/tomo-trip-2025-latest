#!/usr/bin/env python3
import http.server
import socketserver
import os
import signal
import sys
import time
import socket

def find_free_port(start_port=5000, max_attempts=10):
    """Find a free port starting from start_port"""
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    return None

class StableHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
            return
        return super().do_GET()

def signal_handler(sig, frame):
    print('\n🛑 Server shutdown')
    sys.exit(0)

def main():
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Kill existing processes and find free port
    os.system("pkill -9 -f 'python.*simple_server' 2>/dev/null")
    time.sleep(1)
    
    PORT = find_free_port(5000)
    if PORT is None:
        print("❌ No available ports")
        sys.exit(1)
    
    try:
        socketserver.TCPServer.allow_reuse_address = True
        with socketserver.TCPServer(("0.0.0.0", PORT), StableHandler) as httpd:
            print(f"✅ Simple Server起動: ポート{PORT}")
            print(f"🌐 アクセス: http://localhost:{PORT}")
            httpd.serve_forever()
    except Exception as e:
        print(f"❌ エラー: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()