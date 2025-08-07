#!/usr/bin/env python3
"""
TomoTrip - 簡易HTTPサーバー
静的HTMLファイルを提供するシンプルなWebサーバー
"""

import http.server
import socketserver
import os
import sys

def start_server(port=5000):
    """
    指定されたポートでHTTPサーバーを起動
    """
    try:
        # カスタムハンドラーを作成
        class TomoTripHandler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                # 現在のディレクトリをルートとして設定
                super().__init__(*args, directory=os.getcwd(), **kwargs)
            
            def end_headers(self):
                # セキュリティヘッダーを追加
                self.send_header('X-Content-Type-Options', 'nosniff')
                self.send_header('X-Frame-Options', 'DENY')
                self.send_header('X-XSS-Protection', '1; mode=block')
                super().end_headers()
        
        # TCPサーバーを設定
        socketserver.TCPServer.allow_reuse_address = True
        
        # サーバーを起動
        with socketserver.TCPServer(('0.0.0.0', port), TomoTripHandler) as httpd:
            print(f"🌐 TomoTrip Server起動: ポート{port}")
            print(f"📱 アクセスURL: http://localhost:{port}")
            print(f"🛑 停止するには Ctrl+C を押してください")
            print("=" * 50)
            
            # サーバーを永続実行
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 サーバーを停止します...")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ エラー: ポート{port}は既に使用されています")
            # 代替ポートを試す
            alternative_port = port + 1
            print(f"🔄 ポート{alternative_port}で再試行します...")
            start_server(alternative_port)
        else:
            print(f"❌ サーバー起動エラー: {e}")
            sys.exit(1)
    except Exception as e:
        print(f"❌ 予期しないエラー: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # デフォルトポート5000で起動
    start_server(5000)