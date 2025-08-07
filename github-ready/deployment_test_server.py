#!/nix/store/h097imm3w6dpx10qynrd2sz9fks2wbq8-python3-3.12.11/bin/python3
"""
Emergency Production Server - Bypassing all Replit configuration issues
"""
import http.server
import socketserver
import os
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ProductionHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Add security headers
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Serve index.html for root
        if self.path == '/' or self.path == '/index.html':
            try:
                with open('index.html', 'rb') as f:
                    self.wfile.write(f.read())
                logger.info(f"✅ Served index.html successfully")
            except Exception as e:
                logger.error(f"❌ Error serving index.html: {e}")
                self.wfile.write(b"Error loading page")
        else:
            # Handle other files
            super().do_GET()

def start_emergency_server():
    PORT = 5000
    
    print("🚨 EMERGENCY PRODUCTION SERVER")
    print("=" * 50)
    print(f"🌐 Starting on port: {PORT}")
    print(f"📁 Directory: {os.getcwd()}")
    print(f"🐍 Python: {sys.version}")
    print("=" * 50)
    
    # Force kill any existing process on port 5000
    os.system("lsof -ti:5000 | xargs kill -9 2>/dev/null || true")
    
    try:
        # Use SO_REUSEADDR to allow immediate port reuse
        socketserver.TCPServer.allow_reuse_address = True
        with socketserver.TCPServer(("0.0.0.0", PORT), ProductionHandler) as httpd:
            print(f"🚀 Server running at http://0.0.0.0:{PORT}/")
            print("🛑 Press Ctrl+C to stop")
            httpd.serve_forever()
    except Exception as e:
        logger.error(f"❌ Server failed: {e}")
        # Try alternative port
        try:
            PORT = 5001
            print(f"🔄 Retrying on port {PORT}")
            with socketserver.TCPServer(("0.0.0.0", PORT), ProductionHandler) as httpd:
                print(f"🚀 Server running at http://0.0.0.0:{PORT}/")
                httpd.serve_forever()
        except Exception as e2:
            logger.error(f"❌ Alternative port failed: {e2}")
            sys.exit(1)

if __name__ == "__main__":
    start_emergency_server()