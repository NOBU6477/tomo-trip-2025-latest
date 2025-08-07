#!/usr/bin/env python3
"""
TomoTrip Emergency Deployment Script
Direct Python execution bypassing .replit configuration
"""
import os
import sys
import subprocess

def emergency_deploy():
    print("🚨 TomoTrip Emergency Deployment")
    print("=" * 50)
    
    # Force environment setup
    os.environ['PORT'] = '5000'
    os.environ['PYTHONPATH'] = os.getcwd()
    
    # Direct Python server execution
    try:
        print("🐍 Starting Python server directly...")
        subprocess.run([sys.executable, 'main.py'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Emergency deployment failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    emergency_deploy()