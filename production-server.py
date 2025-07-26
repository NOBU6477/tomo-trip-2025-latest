#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import unquote

PORT = 5000

class ProductionHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

    def end_headers(self):
        # キャッシュ完全無効化ヘッダー
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # ルートアクセスをindex.htmlにリダイレクト
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        
        # ファイルパスをデコード
        self.path = unquote(self.path)
        
        # 緊急修正ログ出力
        print(f"✓ アクセス: {self.path}")
        
        return super().do_GET()

    def log_message(self, format, *args):
        # アクセスログをより詳細に
        print(f"[{self.address_string()}] {format % args}")

if __name__ == "__main__":
    os.chdir(".")
    
    # サーバー設定
    with socketserver.TCPServer(("0.0.0.0", PORT), ProductionHTTPRequestHandler) as httpd:
        print("=" * 60)
        print(f"✓ TomoTrip Local Guide プロダクションサーバー起動")
        print(f"✓ アドレス: http://0.0.0.0:{PORT}")
        print(f"✓ 外部アクセス対応: 完全有効")
        print(f"✓ キャッシュ無効化: 強制適用")
        print(f"✓ 緊急修正システム: 配信準備完了")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✓ サーバー正常終了")
            httpd.shutdown()