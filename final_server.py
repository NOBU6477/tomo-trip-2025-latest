#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = int(os.environ.get('PORT', 5000))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        super().do_GET()

class ReusePortServer(socketserver.TCPServer):
    allow_reuse_address = True
    
    def server_bind(self):
        self.socket.setsockopt(socketserver.socket.SOL_SOCKET, socketserver.socket.SO_REUSEADDR, 1)
        super().server_bind()

try:
    httpd = ReusePortServer(("0.0.0.0", PORT), Handler)
    print(f"TomoTrip Server - Port {PORT} - Ready")
    httpd.serve_forever()
except OSError as e:
    if e.errno == 98:
        print(f"Port {PORT} busy, trying alternatives...")
        for alt_port in [5001, 5002, 8000]:
            try:
                httpd = ReusePortServer(("0.0.0.0", alt_port), Handler)
                print(f"TomoTrip Server - Port {alt_port} - Ready")
                httpd.serve_forever()
                break
            except:
                continue