#!/usr/bin/env python3
"""
TomoTrip - Test Server
テスト用HTTPサーバー
"""

import http.server
import socketserver
import os
import sys

def start_test_server(port=5000):
    """
    テスト用HTTPサーバーを起動
    """
    try:
        # テスト用ハンドラー
        class TestHandler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=os.getcwd(), **kwargs)
            
            def end_headers(self):
                # テスト用ヘッダー
                self.send_header('X-Test-Mode', 'active')
                self.send_header('Access-Control-Allow-Origin', '*')
                super().end_headers()
            
            def log_message(self, format, *args):
                # テスト用ログ
                print(f"🧪 TEST: {format % args}")
        
        # サーバー設定
        socketserver.TCPServer.allow_reuse_address = True
        
        with socketserver.TCPServer(('0.0.0.0', port), TestHandler) as httpd:
            print(f"🧪 Test Server起動: ポート{port}")
            print(f"🔬 テストモード有効")
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"⚠️  テストポート{port}は使用中です")
            sys.exit(1)
        else:
            print(f"❌ テストサーバーエラー: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Test Server停止")
        sys.exit(0)

if __name__ == "__main__":
    start_test_server(5000)