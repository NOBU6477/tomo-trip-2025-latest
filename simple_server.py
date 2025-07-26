#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 5000

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
            httpd.allow_reuse_address = True
            print(f"TomoTrip Server running on port {PORT}")
            httpd.serve_forever()
    except OSError as e:
        print(f"Port {PORT} in use, trying port 5001")
        with socketserver.TCPServer(("0.0.0.0", 5001), Handler) as httpd:
            httpd.allow_reuse_address = True
            print(f"TomoTrip Server running on port 5001")
            httpd.serve_forever()