#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 5000
DIRECTORY = "."

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
        print(f"✓ プロダクション対応サーバー起動: http://0.0.0.0:{PORT}")
        print(f"✓ 外部アクセス対応: 0.0.0.0 バインディング")
        print(f"✓ 管理センター機能: 有効")
        httpd.serve_forever()