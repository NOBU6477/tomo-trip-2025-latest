#!/usr/bin/env python3
"""
TomoTrip - Simple HTTP Server
静的ファイル配信用のシンプルサーバー
"""

import http.server
import socketserver
import os
import sys

def start_simple_server(port=5000):
    """
    シンプルHTTPサーバーを起動
    """
    try:
        # カスタムハンドラー
        class SimpleHandler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=os.getcwd(), **kwargs)
            
            def end_headers(self):
                # 基本的なヘッダーを追加
                self.send_header('Cache-Control', 'no-cache')
                super().end_headers()
        
        # サーバー設定
        socketserver.TCPServer.allow_reuse_address = True
        
        with socketserver.TCPServer(('0.0.0.0', port), SimpleHandler) as httpd:
            print(f"🌐 Simple Server起動: ポート{port}")
            print(f"📂 静的ファイル配信中...")
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"⚠️  ポート{port}は使用中です")
            sys.exit(1)
        else:
            print(f"❌ エラー: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Simple Server停止")
        sys.exit(0)

if __name__ == "__main__":
    start_simple_server(5000)