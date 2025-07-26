#!/usr/bin/env python3
"""
TomoTrip Local Guide - Replit対応サーバー
Replitのwebviewプロキシで正常に動作するように設定
"""
import http.server
import socketserver
import os
import sys

PORT = 5000

class ReplitHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # ルートパスを軽量版index_light.htmlにリダイレクト
        if self.path == '/':
            self.path = '/index_light.html'
        return super().do_GET()

    def end_headers(self):
        # Replit Webview用のヘッダー設定
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Frame-Options', 'ALLOWALL')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # カスタムログ形式
        print(f"[TomoTrip] {self.address_string()} - {format % args}")

def main():
    print("=" * 50)
    print("🌴 TomoTrip Local Guide サーバー起動中...")
    print("=" * 50)
    
    # 作業ディレクトリの確認
    print(f"作業ディレクトリ: {os.getcwd()}")
    
    # index.htmlの存在確認
    if os.path.exists('index.html'):
        print("✅ index.html ファイル確認済み")
    else:
        print("❌ index.html が見つかりません")
        sys.exit(1)
    
    try:
        # TCPServerの設定
        with socketserver.TCPServer(("0.0.0.0", PORT), ReplitHandler) as httpd:
            httpd.allow_reuse_address = True
            httpd.timeout = 60
            
            print(f"🚀 TomoTrip サーバー起動完了")
            print(f"📡 ポート: {PORT}")
            print(f"🌐 ローカルアクセス: http://127.0.0.1:{PORT}")
            print(f"🔗 Replitプレビュー: Webviewタブで表示")
            print("=" * 50)
            print("サーバー稼働中... (Ctrl+C で停止)")
            
            # サーバー開始
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 サーバーを停止しています...")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ ポート {PORT} は既に使用中です")
            print("別のサーバーが動作している可能性があります")
        else:
            print(f"❌ サーバーエラー: {e}")
    except Exception as e:
        print(f"❌ 予期しないエラー: {e}")
    finally:
        print("🏁 サーバー終了")

if __name__ == "__main__":
    main()