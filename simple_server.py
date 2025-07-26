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
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_server():
    ports_to_try = [5000, 5001, 8080, 3000]
    
    for port in ports_to_try:
        try:
            with socketserver.TCPServer(("0.0.0.0", port), Handler) as httpd:
                httpd.allow_reuse_address = True
                print(f"TomoTrip Server running on port {port}")
                httpd.serve_forever()
                break
        except OSError as e:
            print(f"Port {port} in use, trying next port...")
            continue
    else:
        print("All ports failed to start")

if __name__ == "__main__":
    start_server()