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
    """Production-ready HTTP request handler with BrokenPipe error handling"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def finish(self):
        """Override finish to handle BrokenPipeError gracefully"""
        try:
            super().finish()
        except (BrokenPipeError, ConnectionResetError, OSError):
            # Client disconnected - ignore silently
            pass
    
    def copyfile(self, source, outputfile):
        """Override copyfile to handle client disconnections"""
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError, OSError):
            # Client disconnected during file transfer - handle gracefully
            pass
    
    def end_headers(self):
        """Add comprehensive security and performance headers"""
        try:
            # Security headers
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('X-Frame-Options', 'SAMEORIGIN')
            self.send_header('X-XSS-Protection', '1; mode=block')
            self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
            
            # Performance headers - more conservative caching for development
            self.send_header('Cache-Control', 'public, max-age=300')
            
            # CORS headers for deployment
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            
            super().end_headers()
        except (BrokenPipeError, ConnectionResetError, OSError):
            # Client disconnected - ignore header errors
            pass
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        try:
            self.send_response(200)
            self.end_headers()
        except (BrokenPipeError, ConnectionResetError, OSError):
            pass
    
    def log_message(self, format, *args):
        """Enhanced logging for production - suppress connection errors"""
        # Don't log BrokenPipe and connection reset errors
        message = format % args
        if 'Broken pipe' in message or 'Connection reset' in message:
            return
        
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        formatted_message = f"[{timestamp}] {message}"
        print(formatted_message)

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
        # Configure TCP server with enhanced error handling
        socketserver.TCPServer.allow_reuse_address = True
        
        # Custom TCP Server class to handle connection errors
        class RobustTCPServer(socketserver.TCPServer):
            def handle_error(self, request, client_address):
                """Handle request errors gracefully"""
                import traceback
                exc_type, exc_value, exc_traceback = sys.exc_info()
                
                # Ignore common client disconnection errors
                if isinstance(exc_value, (BrokenPipeError, ConnectionResetError, OSError)):
                    return
                
                # Log other errors normally
                logging.error(f"Request error from {client_address}: {exc_value}")
                traceback.print_exc()
        
        # Create and configure server
        with RobustTCPServer(('0.0.0.0', port), TomoTripHandler) as httpd:
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