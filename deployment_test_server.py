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
    def end_headers(self):
        """Override to ensure CORS and proper headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        """Override to ensure correct MIME types - ESM requires text/javascript"""
        if path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.png'):
            return 'image/png'
        elif path.endswith('.jpg') or path.endswith('.jpeg'):
            return 'image/jpeg'
        elif path.endswith('.js') or path.endswith('.mjs'):
            return 'text/javascript'  # ESM modules require text/javascript
        return super().guess_type(path)
    
    def do_GET(self):
        # Handle root path
        if self.path == '/' or self.path == '/index.html':
            try:
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.send_header('X-Frame-Options', 'SAMEORIGIN')
                self.send_header('X-Content-Type-Options', 'nosniff')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                # Try public/index.html first, then fallback
                try:
                    with open('public/index.html', 'rb') as f:
                        self.wfile.write(f.read())
                    logger.info(f"✅ Served public/index.html successfully")
                except FileNotFoundError:
                    with open('index.html', 'rb') as f:
                        self.wfile.write(f.read())
                    logger.info(f"✅ Served fallback index.html successfully")
            except Exception as e:
                logger.error(f"❌ Error serving index.html: {e}")
                self.send_error(500, "Error loading page")
        else:
            # Try serving from public/ first, then fallback to root
            requested_path = self.path.lstrip('/')
            public_file_path = os.path.join('public', requested_path)
            
            # Debug logging
            logger.info(f"🔍 Looking for: {requested_path}")
            logger.info(f"🔍 Public path: {public_file_path}")
            logger.info(f"🔍 File exists: {os.path.exists(public_file_path)}")
            logger.info(f"🔍 Current dir: {os.getcwd()}")
            
            if os.path.exists(public_file_path) and os.path.isfile(public_file_path):
                try:
                    self.send_response(200)
                    
                    # Force correct MIME types for ESM modules
                    if public_file_path.endswith('.mjs') or public_file_path.endswith('.js'):
                        self.send_header('Content-Type', 'text/javascript; charset=utf-8')
                    elif public_file_path.endswith('.css'):
                        self.send_header('Content-Type', 'text/css; charset=utf-8')
                    elif public_file_path.endswith('.png'):
                        self.send_header('Content-Type', 'image/png')
                    elif public_file_path.endswith(('.jpg', '.jpeg')):
                        self.send_header('Content-Type', 'image/jpeg')
                    elif public_file_path.endswith('.woff2'):
                        self.send_header('Content-Type', 'font/woff2')
                    elif public_file_path.endswith('.woff'):
                        self.send_header('Content-Type', 'font/woff')
                    elif public_file_path.endswith('.svg'):
                        self.send_header('Content-Type', 'image/svg+xml')
                    else:
                        content_type = self.guess_type(public_file_path)
                        if content_type:
                            self.send_header('Content-Type', content_type)
                    
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    with open(public_file_path, 'rb') as f:
                        self.wfile.write(f.read())
                    logger.info(f"✅ Served {public_file_path} from public/")
                except Exception as e:
                    logger.error(f"❌ Error serving {public_file_path}: {e}")
                    self.send_error(500, "Error loading file")
            else:
                # Fallback to default handling
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