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

httpd = socketserver.TCPServer(("0.0.0.0", PORT), Handler)
httpd.allow_reuse_address = True
print(f"TomoTrip Server - Port {PORT} - External Access Ready")
httpd.serve_forever()