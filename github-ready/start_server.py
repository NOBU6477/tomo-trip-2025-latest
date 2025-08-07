#!/usr/bin/env python3
"""
TomoTrip Direct Server Launcher
Simplified approach - direct Python execution
"""
import subprocess
import sys
import os

def main():
    print("🚀 TomoTrip Direct Launcher")
    print("=" * 40)
    
    # Set environment variables
    os.environ['PORT'] = '5000'
    os.environ['PYTHONPATH'] = os.getcwd()
    
    try:
        print("🐍 Starting Python server (main.py)...")
        # Use exec to replace the current process
        os.execv(sys.executable, [sys.executable, 'main.py'])
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()