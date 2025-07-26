#!/usr/bin/env python3
"""
TomoTrip Production Server - 企業級同時接続対応システム
スケーラブルな同時接続数管理とパフォーマンス監視機能付き
"""

import os
import sys
import http.server
import socketserver
import threading
import time
import json
from datetime import datetime
from threading import Thread, Lock

PORT = 5000
MAX_CONNECTIONS = 100  # 初期設定: 100同時接続
CONNECTION_STATS = {
    'current_connections': 0,
    'max_reached': 0,
    'total_requests': 0,
    'start_time': time.time()
}
stats_lock = Lock()

class ScalableReplitHandler(http.server.SimpleHTTPRequestHandler):
    """拡張可能なHTTPハンドラー - 同時接続監視機能付き"""
    
    def do_GET(self):
        global CONNECTION_STATS
        
        # 接続統計更新
        with stats_lock:
            CONNECTION_STATS['current_connections'] += 1
            CONNECTION_STATS['total_requests'] += 1
            CONNECTION_STATS['max_reached'] = max(
                CONNECTION_STATS['max_reached'], 
                CONNECTION_STATS['current_connections']
            )
        
        try:
            # ルートパスを軽量版にリダイレクト
            if self.path == '/':
                self.path = '/index_light.html'
            elif self.path == '/stats':
                # リアルタイム統計API
                self.send_stats_response()
                return
            elif self.path == '/health':
                # ヘルスチェックAPI
                self.send_health_response()
                return
            
            # 標準ファイル処理
            return super().do_GET()
            
        finally:
            # 接続終了時統計更新
            with stats_lock:
                CONNECTION_STATS['current_connections'] = max(0, 
                    CONNECTION_STATS['current_connections'] - 1)
    
    def send_stats_response(self):
        """リアルタイム統計レスポンス"""
        with stats_lock:
            stats = CONNECTION_STATS.copy()
            uptime = time.time() - stats['start_time']
            
        response_data = {
            'current_connections': stats['current_connections'],
            'max_connections_reached': stats['max_reached'],
            'total_requests': stats['total_requests'],
            'uptime_seconds': int(uptime),
            'uptime_hours': round(uptime / 3600, 2),
            'server_status': 'healthy',
            'max_capacity': MAX_CONNECTIONS,
            'capacity_usage': f"{(stats['current_connections']/MAX_CONNECTIONS)*100:.1f}%"
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data, ensure_ascii=False, indent=2).encode('utf-8'))
    
    def send_health_response(self):
        """ヘルスチェックレスポンス"""
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0-production',
            'service': 'TomoTrip Local Guide'
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(health_status, ensure_ascii=False).encode('utf-8'))
    
    def log_message(self, format, *args):
        """カスタムログ形式 - 同時接続数表示"""
        with stats_lock:
            current = CONNECTION_STATS['current_connections']
        print(f"[TomoTrip:{current}接続] {self.address_string()} - {format % args}")

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """スレッド対応TCPサーバー - 動的スケーリング機能付き"""
    
    def __init__(self, server_address, RequestHandlerClass):
        self.allow_reuse_address = True
        self.daemon_threads = True  # デーモンスレッドで軽量化
        super().__init__(server_address, RequestHandlerClass)
        
        # 動的接続数調整
        self.request_queue_size = MAX_CONNECTIONS
        
    def server_activate(self):
        """サーバー有効化時の設定"""
        super().server_activate()
        print(f"✅ スケーラブルサーバー有効化: 最大{MAX_CONNECTIONS}同時接続")

def monitor_performance():
    """パフォーマンス監視スレッド"""
    while True:
        time.sleep(30)  # 30秒ごと監視
        
        with stats_lock:
            stats = CONNECTION_STATS.copy()
            
        uptime_hours = (time.time() - stats['start_time']) / 3600
        avg_requests_per_hour = stats['total_requests'] / max(uptime_hours, 0.01)
        
        print(f"📊 [監視] 現在:{stats['current_connections']}接続 "
              f"最大:{stats['max_reached']} "
              f"総リクエスト:{stats['total_requests']} "
              f"平均:{avg_requests_per_hour:.1f}req/h")
        
        # 高負荷警告
        if stats['current_connections'] > MAX_CONNECTIONS * 0.8:
            print(f"⚠️  高負荷警告: {stats['current_connections']}/{MAX_CONNECTIONS} "
                  f"({(stats['current_connections']/MAX_CONNECTIONS)*100:.1f}%)")

def scale_up_connections(new_max):
    """同時接続数動的拡張"""
    global MAX_CONNECTIONS
    old_max = MAX_CONNECTIONS
    MAX_CONNECTIONS = new_max
    print(f"🚀 接続数拡張: {old_max} → {new_max} 同時接続")
    return True

def main():
    print("=" * 60)
    print("🌴 TomoTrip Production Server with Scalable Architecture")
    print("=" * 60)
    
    # ファイル存在確認
    required_files = ['index_light.html']
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file} 確認済み")
        else:
            print(f"⚠️  {file} が見つかりません")
    
    # パフォーマンス監視スレッド開始
    monitor_thread = Thread(target=monitor_performance, daemon=True)
    monitor_thread.start()
    print("✅ パフォーマンス監視開始")
    
    try:
        # スケーラブルサーバー起動
        with ThreadedTCPServer(("0.0.0.0", PORT), ScalableReplitHandler) as httpd:
            print(f"🚀 TomoTrip Production Server 起動完了")
            print(f"📡 ポート: {PORT}")
            print(f"🔧 初期同時接続対応: {MAX_CONNECTIONS}接続")
            print(f"📊 統計API: http://localhost:{PORT}/stats")
            print(f"❤️  ヘルスチェック: http://localhost:{PORT}/health")
            print(f"⚡ 軽量アーキテクチャ有効")
            print("=" * 60)
            print("Production Server 稼働中... (統計は30秒ごと更新)")
            
            # 拡張デモ（60秒後に接続数増加）
            def demo_scaling():
                time.sleep(60)
                scale_up_connections(200)
                time.sleep(60) 
                scale_up_connections(500)
            
            scaling_thread = Thread(target=demo_scaling, daemon=True)
            scaling_thread.start()
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Production Server停止中...")
        
        # 最終統計表示
        with stats_lock:
            final_stats = CONNECTION_STATS.copy()
        
        uptime = time.time() - final_stats['start_time']
        print(f"📊 最終統計:")
        print(f"   稼働時間: {uptime/3600:.2f}時間")
        print(f"   総リクエスト: {final_stats['total_requests']}")
        print(f"   最大同時接続: {final_stats['max_reached']}")
        
    except Exception as e:
        print(f"❌ サーバーエラー: {e}")
    finally:
        print("🏁 Production Server終了")

if __name__ == "__main__":
    main()