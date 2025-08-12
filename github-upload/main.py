#!/usr/bin/env python3
"""
TomoTrip Main Entry Point
Simplified entry point for Replit deployments
"""
import subprocess
import sys
import os

def main():
    """Main entry point that starts the deployment server"""
    print("🚀 TomoTrip - Starting deployment server...")
    
    # Ensure environment variables are set
    os.environ.setdefault('PORT', '5000')
    os.environ.setdefault('PYTHONPATH', '.')
    
    try:
        # Start the deployment server directly
        subprocess.run([sys.executable, 'deployment_test_server.py'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("🛑 Server stopped")
        sys.exit(0)

if __name__ == "__main__":
    main()