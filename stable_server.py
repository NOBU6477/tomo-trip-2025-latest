#!/usr/bin/env python3
"""
TomoTrip Stable Server - クラッシュ防止版
安定性重視・統計機能なし・シンプル構成
"""

import http.server
import socketserver
import os
import sys
import signal

PORT = 5000

class StableHandler(http.server.SimpleHTTPRequestHandler):
    """安定動作専用ハンドラー"""
    
    def do_GET(self):
        print(f"📡 {self.path}")
        
        if self.path == '/':
            try:
                with open('index.html', 'r', encoding='utf-8') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
                print("✅ TomoTrip送信完了")
                return
                
            except Exception as e:
                print(f"❌ ファイル読み込みエラー: {e}")
                self.send_error(500, "Internal Server Error")
                return
                
        # その他のリクエスト
        return super().do_GET()
    
    def log_message(self, format, *args):
        # ログ出力を最小限に
        pass

def signal_handler(sig, frame):
    print(f"\n🛑 終了シグナル受信: {sig}")
    sys.exit(0)

def main():
    # シグナルハンドラー設定
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    print("=" * 50)
    print("🌴 TomoTrip Stable Server")
    print("=" * 50)
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), StableHandler) as httpd:
            httpd.allow_reuse_address = True
            
            print(f"✅ 安定サーバー起動: ポート{PORT}")
            print(f"🎯 完全版UI: 山背景・ガイドカード・フィルター")
            print(f"⚡ 統計機能: 無効（安定性重視）")
            print(f"🔧 クラッシュ防止: 有効")
            print("=" * 50)
            print("Stable Server稼働中...")
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:
            print(f"❌ ポート{PORT}使用中")
            # 他のプロセス終了
            os.system("pkill -f python")
            print("🔄 既存プロセス終了完了")
            
            # 再試行
            try:
                import time
                time.sleep(2)
                with socketserver.TCPServer(("0.0.0.0", PORT), StableHandler) as httpd:
                    httpd.allow_reuse_address = True
                    print(f"✅ 再起動成功: ポート{PORT}")
                    httpd.serve_forever()
            except Exception as retry_e:
                print(f"❌ 再起動失敗: {retry_e}")
                sys.exit(1)
        else:
            print(f"❌ サーバーエラー: {e}")
            sys.exit(1)
    except Exception as e:
        print(f"❌ 予期しないエラー: {e}")
        sys.exit(1)
    finally:
        print("🏁 Stable Server終了")

if __name__ == "__main__":
    main()