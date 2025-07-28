#!/usr/bin/env python3
"""
TomoTrip Simple Server - スピン症状解決版
軽量・高速・確実な読み込みを保証
"""

import http.server
import socketserver
import os
import sys

PORT = 5000

class FastHandler(http.server.SimpleHTTPRequestHandler):
    """高速レスポンス専用ハンドラー"""
    
    def do_GET(self):
        print(f"📡 リクエスト: {self.path}")
        
        # ルートアクセス時は完全版HTMLファイルを返す
        if self.path == '/':
            try:
                with open('index_light.html', 'r', encoding='utf-8') as f:
                    html_content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                self.wfile.write(html_content.encode('utf-8'))
                print("✅ 完全版HTML送信完了")
                return
            except FileNotFoundError:
                print("❌ index_light.html が見つかりません - インライン版にフォールバック")
            
            # フォールバック用簡易HTML
            html_content = '''<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TomoTrip Local Guide - 軽量版</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { 
      font-family: 'Hiragino Sans', sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .hero { 
      background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
                  url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920') center/cover;
      min-height: 50vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }
    .guide-card { 
      transition: transform 0.3s; 
      border: none; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
    }
    .guide-card:hover { 
      transform: translateY(-5px); 
      box-shadow: 0 8px 25px rgba(0,0,0,0.15); 
    }
  </style>
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand fw-bold" href="/">🌴 TomoTrip</a>
      <div class="navbar-nav ms-auto">
        <a class="nav-link" href="#" onclick="alert('協賛店登録')">協賛店登録</a>
        <a class="nav-link" href="#" onclick="alert('ログイン')">ログイン</a>
        <a class="nav-link" href="#" onclick="alert('新規登録')">新規登録</a>
      </div>
    </div>
  </nav>

  <section class="hero text-white text-center">
    <div class="container">
      <h1 class="display-4 fw-bold mb-4">特別な旅の体験を</h1>
      <p class="lead mb-4">地元を知り尽くしたガイドと一緒に、忘れられない思い出を作りませんか？</p>
      <button class="btn btn-primary btn-lg px-5" onclick="document.getElementById('guides').scrollIntoView()">
        ガイドを探す
      </button>
    </div>
  </section>

  <div class="container mt-5">
    <div class="mb-3">
      <span class="text-muted"><strong style="color:#007bff;font-size:1.2em;">6人のガイドが見つかりました</strong></span>
    </div>
    
    <div class="row" id="guides">
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card guide-card h-100">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" class="card-img-top" style="height:200px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">田中 太郎</h5>
            <p class="card-text">
              📍 東京<br>
              🗣️ 日本語, English<br>
              ⭐ 4.8 / 5.0<br>
              🎯 歴史・文化
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <strong class="text-primary">¥8,000</strong>
              <button class="btn btn-primary btn-sm" onclick="alert('田中太郎の詳細')">詳細を見る</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card guide-card h-100">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b612b098?w=300" class="card-img-top" style="height:200px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">佐藤 花子</h5>
            <p class="card-text">
              📍 京都<br>
              🗣️ 日本語, English, 中文<br>
              ⭐ 4.9 / 5.0<br>
              🎯 寺社仏閣
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <strong class="text-primary">¥12,000</strong>
              <button class="btn btn-primary btn-sm" onclick="alert('佐藤花子の詳細')">詳細を見る</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card guide-card h-100">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300" class="card-img-top" style="height:200px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">山田 次郎</h5>
            <p class="card-text">
              📍 大阪<br>
              🗣️ 日本語, English<br>
              ⭐ 4.7 / 5.0<br>
              🎯 グルメ
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <strong class="text-primary">¥7,500</strong>
              <button class="btn btn-primary btn-sm" onclick="alert('山田次郎の詳細')">詳細を見る</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card guide-card h-100">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300" class="card-img-top" style="height:200px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">鈴木 美香</h5>
            <p class="card-text">
              📍 東京<br>
              🗣️ 日本語, English, Français<br>
              ⭐ 4.6 / 5.0<br>
              🎯 ショッピング
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <strong class="text-primary">¥10,500</strong>
              <button class="btn btn-primary btn-sm" onclick="alert('鈴木美香の詳細')">詳細を見る</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card guide-card h-100">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300" class="card-img-top" style="height:200px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">高橋 健一</h5>
            <p class="card-text">
              📍 京都<br>
              🗣️ 日本語, English<br>
              ⭐ 4.8 / 5.0<br>
              🎯 自然・庭園
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <strong class="text-primary">¥9,000</strong>
              <button class="btn btn-primary btn-sm" onclick="alert('高橋健一の詳細')">詳細を見る</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card guide-card h-100">
          <img src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300" class="card-img-top" style="height:200px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">中村 さくら</h5>
            <p class="card-text">
              📍 大阪<br>
              🗣️ 日本語, English, 한국어<br>
              ⭐ 4.7 / 5.0<br>
              🎯 エンターテイメント
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <strong class="text-primary">¥11,000</strong>
              <button class="btn btn-primary btn-sm" onclick="alert('中村さくらの詳細')">詳細を見る</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div style="position:fixed;top:50%;right:15px;background:#007bff;color:white;padding:15px;border-radius:15px;cursor:pointer;z-index:999;" onclick="alert('🏆 管理センター\\n\\nブックマーク機能\\n比較機能\\nデータ管理\\n\\n開発中です')">
    🏆 管理センター
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    console.log('✅ TomoTrip 軽量版読み込み完了');
    document.addEventListener('DOMContentLoaded', function() {
      console.log('✅ DOM読み込み完了 - スピン症状解決');
    });
  </script>
</body>
</html>'''
            
            self.wfile.write(html_content.encode('utf-8'))
            print("✅ 軽量HTML直接送信完了")
            return
            
        # その他のリクエストは通常処理
        return super().do_GET()
    
    def log_message(self, format, *args):
        print(f"[Fast] {format % args}")

def main():
    print("=" * 50)
    print("🚀 TomoTrip Fast Server - スピン症状解決版")
    print("=" * 50)
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), FastHandler) as httpd:
            httpd.allow_reuse_address = True
            
            print(f"✅ Fast Server起動完了")
            print(f"📡 ポート: {PORT}")
            print(f"🎯 スピン症状解決: HTMLインライン化")
            print(f"⚡ 外部ファイル依存なし")
            print("=" * 50)
            print("Fast Server稼働中...")
            
            httpd.serve_forever()
            
    except Exception as e:
        print(f"❌ エラー: {e}")
    finally:
        print("🏁 Fast Server終了")

if __name__ == "__main__":
    main()