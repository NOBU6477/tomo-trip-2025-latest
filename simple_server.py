#!/usr/bin/env python3
"""
TomoTrip Simple Server - 外部アクセス対応
"""

import http.server
import socketserver
import os
import sys
from datetime import datetime

PORT = int(os.environ.get('PORT', 5000))

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)
    
    def end_headers(self):
        # 外部アクセス対応ヘッダー
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    
    def log_message(self, format, *args):
        # アクセスログ出力
        sys.stdout.write(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    with socketserver.TCPServer(("0.0.0.0", PORT), SimpleHandler) as httpd:
        print("=" * 50)
        print("🏝️ TomoTrip Simple Server")
        print("=" * 50)
        print(f"📍 URL: http://0.0.0.0:{PORT}")
        print(f"🌐 外部アクセス: 対応済み")
        print(f"⚡ 起動時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 50)
        httpd.serve_forever()