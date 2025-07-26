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
    print("🌴 TomoTrip Production Server 起動中...")
    print("=" * 50)
    
    # ファイル存在確認
    required_files = ['index_light.html', 'TomoTripロゴ.png']
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file} 確認済み")
        else:
            print(f"⚠️  {file} が見つかりません - 代替処理で継続")
    
    try:
        # 本格運用対応のTCPServer設定
        with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), ReplitHandler) as httpd:
            httpd.allow_reuse_address = True
            httpd.timeout = None  # 本格運用では無制限
            httpd.request_queue_size = 50  # 同時接続数増加対応
            
            print(f"🚀 TomoTrip Production Server 起動完了")
            print(f"📡 ポート: {PORT}")
            print(f"🔧 同時接続対応: 最大50接続")
            print(f"⚡ 処理速度: 軽量版で最適化済み")
            print(f"🌐 本格運用準備完了")
            print("=" * 50)
            print("Production Server 稼働中...")
            
            # 本格運用サーバー開始
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Production Server停止中...")
    except OSError as e:
        if e.errno == 98:
            print(f"❌ ポート {PORT} 使用中 - 自動代替ポート選択")
            # 代替ポート自動選択
            for alt_port in [5001, 8080, 3000, 8000]:
                try:
                    with socketserver.ThreadingTCPServer(("0.0.0.0", alt_port), ReplitHandler) as httpd:
                        httpd.allow_reuse_address = True
                        print(f"✅ 代替ポート {alt_port} で起動成功")
                        httpd.serve_forever()
                        break
                except OSError:
                    continue
        else:
            print(f"❌ サーバーエラー: {e}")
    except Exception as e:
        print(f"❌ 予期しないエラー: {e}")
    finally:
        print("🏁 Production Server終了")

if __name__ == "__main__":
    main()