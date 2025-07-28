#!/usr/bin/env python3
"""
TomoTrip Production Server - 元のUI完全復元版
前回の山背景・詳細ガイドカード・フィルター機能を含む完全版
"""

import http.server
import socketserver
import os
import threading
import time
from urllib.parse import parse_qs, urlparse

PORT = 5000

class TomoTripHandler(http.server.SimpleHTTPRequestHandler):
    """完全版TomoTrip専用ハンドラー"""
    
    def do_GET(self):
        print(f"📡 リクエスト: {self.path}")
        
        if self.path == '/':
            # 完全版index_light.htmlを返す
            try:
                with open('index_light.html', 'r', encoding='utf-8') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
                print("✅ 完全版TomoTrip送信完了")
                return
                
            except FileNotFoundError:
                print("❌ index_light.html見つからず")
                
        # その他のリクエスト
        return super().do_GET()
    
    def log_message(self, format, *args):
        print(f"[TomoTrip] {format % args}")

def main():
    print("=" * 60)
    print("🌴 TomoTrip Production Server - 完全版UI復元")
    print("=" * 60)
    
    # ポート確認
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), TomoTripHandler) as httpd:
            httpd.allow_reuse_address = True
            
            print(f"✅ TomoTrip Production Server起動完了")
            print(f"📡 ポート: {PORT}")
            print(f"🎯 完全版UI: 山背景・詳細ガイド・フィルター機能")
            print(f"🏔️ Hero背景: 山岳風景")
            print(f"👥 6人ガイドカード: 詳細プロフィール表示")
            print(f"🔍 フィルター: 地域・言語・料金検索")
            print(f"🏆 管理センター: ブックマーク・比較機能")
            print("=" * 60)
            print("Production Server稼働中...")
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ ポート{PORT}は使用中です")
            print("🔄 プロセス終了を試行中...")
            os.system(f"pkill -f python")
            time.sleep(2)
            
            # 再試行
            try:
                with socketserver.TCPServer(("0.0.0.0", PORT), TomoTripHandler) as httpd:
                    httpd.allow_reuse_address = True
                    print(f"✅ ポート{PORT}で再起動成功")
                    httpd.serve_forever()
            except Exception as retry_e:
                print(f"❌ 再起動失敗: {retry_e}")
        else:
            print(f"❌ サーバーエラー: {e}")
    except Exception as e:
        print(f"❌ 一般エラー: {e}")
    finally:
        print("🏁 TomoTrip Production Server終了")

if __name__ == "__main__":
    main()