#!/usr/bin/env python3
import http.server
import socketserver
import os
import socket
import time

def find_free_port(start_port=5000, max_port=5010):
    for port in range(start_port, max_port + 1):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', port))
                return port
        except OSError:
            continue
    return None

class EmergencyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = find_free_port()
    if PORT is None:
        print("❌ 利用可能なポートが見つかりません")
        exit(1)
    
    os.chdir(".")
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), EmergencyHandler) as httpd:
            print("=" * 50)
            print(f"✓ 緊急サーバー起動成功: http://0.0.0.0:{PORT}")
            print(f"✓ 外部アクセス対応完了")
            print(f"✓ キャッシュバスター有効")
            print("=" * 50)
            httpd.serve_forever()
    except Exception as e:
        print(f"❌ サーバー起動エラー: {e}")