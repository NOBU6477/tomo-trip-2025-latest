#!/usr/bin/env python3
"""
TomoTrip Universal Launcher
Handles both development and deployment scenarios
"""
import subprocess
import sys
import os

def main():
    print("🚀 TomoTrip Universal Launcher")
    
    # Check if we're in deployment or development
    if os.getenv('REPLIT_DEPLOYMENT'):
        print("📦 Deployment mode detected")
    else:
        print("🔧 Development mode detected")
    
    # Start the Python server directly
    try:
        print("🐍 Starting Python server...")
        subprocess.run([sys.executable, 'main.py'], check=True)
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()