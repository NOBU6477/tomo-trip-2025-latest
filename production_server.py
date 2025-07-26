#!/usr/bin/env python3
"""
TomoTrip Local Guide - Production Web Server
本格運用対応の高性能Webサーバー
"""

import http.server
import socketserver
import os
import json
import mimetypes
from urllib.parse import unquote, urlparse, parse_qs
from datetime import datetime
import threading
import time

PORT = int(os.environ.get('PORT', 5000))

class ProductionHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)
    
    def log_message(self, format, *args):
        """アクセスログ強化"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {self.address_string()} - {format % args}")
    
    def end_headers(self):
        """プロダクション対応ヘッダー設定"""
        # CORS対応
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        
        # キャッシュ制御（本格運用対応）
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        # セキュリティヘッダー
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        super().end_headers()
    
    def do_GET(self):
        """GET要求処理"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # API エンドポイント処理
        if path.startswith('/api/'):
            return self.handle_api_request(path, parsed_path.query)
        
        # ルートアクセス処理
        if path == '/' or path == '':
            path = '/index.html'
        
        # パス正規化
        path = unquote(path)
        if path.startswith('/'):
            path = path[1:]
        
        # ファイル存在確認
        if os.path.isfile(path):
            return super().do_GET()
        else:
            self.send_custom_404()
    
    def handle_api_request(self, path, query):
        """API要求処理"""
        if path == '/api/system-status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            status = {
                "status": "healthy",
                "server": "TomoTrip Production Server",
                "version": "1.0.0",
                "timestamp": datetime.now().isoformat(),
                "external_access": True,
                "features": {
                    "multi_threading": True,
                    "cors_support": True,
                    "security_headers": True,
                    "enhanced_logging": True
                }
            }
            
            self.wfile.write(json.dumps(status, ensure_ascii=False).encode('utf-8'))
            return
        
        elif path == '/api/guides':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            # デモガイドデータ
            guides = [
                {"id": 1, "name": "田中健太", "location": "東京", "specialties": ["夜景ツアー", "グルメ"], "price": 8000, "rating": 4.8},
                {"id": 2, "name": "佐藤美香", "location": "京都", "specialties": ["寺院巡り", "文化体験"], "price": 7500, "rating": 4.9},
                {"id": 3, "name": "山田太郎", "location": "大阪", "specialties": ["グルメツアー", "エンタメ"], "price": 6500, "rating": 4.7},
                {"id": 4, "name": "鈴木花子", "location": "神戸", "specialties": ["港町散策", "夜景"], "price": 7000, "rating": 4.8},
                {"id": 5, "name": "高橋正男", "location": "名古屋", "specialties": ["歴史探訪", "グルメ"], "price": 6800, "rating": 4.6},
                {"id": 6, "name": "伊藤あゆみ", "location": "福岡", "specialties": ["グルメ", "ショッピング"], "price": 6300, "rating": 4.9}
            ]
            
            self.wfile.write(json.dumps({"guides": guides, "count": len(guides)}, ensure_ascii=False).encode('utf-8'))
            return
        
        # 未対応API
        self.send_response(404)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"error": "API endpoint not found"}).encode('utf-8'))
    
    def send_custom_404(self):
        """カスタム404ページ"""
        self.send_response(404)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        
        html_content = """
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TomoTrip - ページが見つかりません</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                .error-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                .error-card { background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; }
                .logo { font-size: 3em; margin-bottom: 20px; }
                .btn-home { background: linear-gradient(135deg, #007bff, #0056b3); border: none; padding: 12px 30px; border-radius: 25px; color: white; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="error-container">
                <div class="error-card">
                    <div class="logo">🏝️</div>
                    <h1 class="text-primary mb-3">TomoTrip</h1>
                    <h2 class="h4 mb-3">ページが見つかりません</h2>
                    <p class="text-muted mb-4">お探しのページは存在しないか、移動された可能性があります。</p>
                    <a href="/" class="btn btn-home">🏠 トップページに戻る</a>
                </div>
            </div>
        </body>
        </html>
        """
        self.wfile.write(html_content.encode('utf-8'))
    
    def do_OPTIONS(self):
        """CORS プリフライト対応"""
        self.send_response(200)
        self.end_headers()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """マルチスレッド対応サーバー（本格運用対応）"""
    allow_reuse_address = True
    daemon_threads = True

def start_server():
    """サーバー起動"""
    os.chdir(".")
    
    try:
        with ThreadedTCPServer(("0.0.0.0", PORT), ProductionHandler) as httpd:
            print("=" * 70)
            print("🏝️  TomoTrip Local Guide - Production Server 🏝️")
            print("=" * 70)
            print(f"📍 Server URL: http://0.0.0.0:{PORT}")
            print(f"🌐 External Access: ENABLED")
            print(f"⚡ Production Mode: ACTIVE")
            print(f"🔐 Security Headers: ENABLED")
            print(f"🚀 Multi-threading: ENABLED")
            print(f"📊 Enhanced Logging: ACTIVE")
            print(f"🛡️  CORS Support: FULL")
            print("=" * 70)
            print(f"✅ Server started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("   Press Ctrl+C to stop the server")
            print("=" * 70)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n" + "=" * 50)
        print("🛑 Server shutdown requested...")
        print("✅ TomoTrip Server stopped gracefully")
        print("=" * 50)
    except Exception as e:
        print(f"❌ Server error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    start_server()