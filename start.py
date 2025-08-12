#!/usr/bin/env python3
"""
Simple startup script for TomoTrip deployment
This ensures compatibility with Replit's deployment system
"""
import subprocess
import sys
import os

def main():
    print("🚀 Starting TomoTrip deployment server...")
    
    # Set environment variables
    os.environ['PYTHONPATH'] = '.'
    os.environ['PORT'] = str(os.environ.get('PORT', 5000))
    
    try:
        # Start the main server
        subprocess.run([sys.executable, 'deployment_test_server.py'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("🛑 Server stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    main()