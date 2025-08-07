#!/usr/bin/env python3
"""
TomoTrip - Production HTTP Server
Production-ready web server for TomoTrip tourism platform
Optimized for Replit deployment with comprehensive error handling
"""

import http.server
import socketserver
import os
import sys
import signal
import threading
import time
import logging

class TomoTripHandler(http.server.SimpleHTTPRequestHandler):
    """Production-ready HTTP request handler with enhanced features"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        """Add comprehensive security and performance headers"""
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')  # Less restrictive for deployment
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        
        # Performance headers
        self.send_header('Cache-Control', 'public, max-age=31536000')
        
        # CORS headers for deployment
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Enhanced logging for production"""
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        message = f"[{timestamp}] {format % args}"
        print(message)

def setup_logging():
    """Configure production logging"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

def signal_handler(signum, frame):
    """Graceful shutdown handler"""
    print(f"\n🛑 Received signal {signum} - shutting down gracefully...")
    sys.exit(0)

def health_check_thread(port):
    """Background health check for deployment monitoring"""
    import urllib.request
    import urllib.error
    
    while True:
        try:
            time.sleep(30)  # Check every 30 seconds
            urllib.request.urlopen(f'http://localhost:{port}/', timeout=5)
            logging.info("✅ Health check passed")
        except Exception as e:
            logging.warning(f"⚠️ Health check failed: {e}")
        
def start_server(port=None):
    """
    Production-ready server startup with comprehensive error handling
    """
    # Get port from environment or default
    if port is None:
        port = int(os.environ.get('PORT', 5000))
    
    # Setup logging
    setup_logging()
    
    # Setup signal handlers
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        # Configure TCP server
        socketserver.TCPServer.allow_reuse_address = True
        
        # Create and configure server
        with socketserver.TCPServer(('0.0.0.0', port), TomoTripHandler) as httpd:
            print("=" * 60)
            print("🌴 TomoTrip Production Server")
            print("=" * 60)
            print(f"🌐 Server started on port: {port}")
            print(f"📱 Local URL: http://localhost:{port}")
            print(f"🌍 External URL: http://0.0.0.0:{port}")
            print(f"🐍 Python version: {sys.version}")
            print(f"📁 Serving directory: {os.getcwd()}")
            print("🛑 Press Ctrl+C to stop")
            print("=" * 60)
            
            # Start health check thread
            health_thread = threading.Thread(
                target=health_check_thread, 
                args=(port,), 
                daemon=True
            )
            health_thread.start()
            logging.info("✅ Health check monitoring started")
            
            # Start server
            logging.info(f"🚀 Server listening on 0.0.0.0:{port}")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        logging.info("🛑 Keyboard interrupt received - shutting down...")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # Address already in use
            logging.error(f"❌ Port {port} is already in use")
            # Try alternative port
            alternative_port = port + 1
            logging.info(f"🔄 Retrying on port {alternative_port}...")
            start_server(alternative_port)
        else:
            logging.error(f"❌ Server startup error: {e}")
            sys.exit(1)
    except Exception as e:
        logging.error(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # デフォルトポート5000で起動
    start_server(5000)