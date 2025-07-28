#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 5000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

try:
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"✅ Simple Server起動: ポート{PORT}")
        print(f"🌐 アクセス: http://localhost:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 サーバー停止")
except Exception as e:
    print(f"❌ エラー: {e}")