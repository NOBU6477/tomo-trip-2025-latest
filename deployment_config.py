#!/usr/bin/env python3
"""
Simple deployment configuration for TomoTrip
Ensures proper deployment settings for Replit hosting
"""
import os
import sys

# Deployment configuration
DEPLOYMENT_PORT = int(os.environ.get('PORT', 5000))
HOST = '0.0.0.0'

# Ensure proper Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def get_deployment_config():
    """Get deployment configuration"""
    return {
        'host': HOST,
        'port': DEPLOYMENT_PORT,
        'debug': False,
        'threaded': True
    }

def validate_deployment():
    """Validate deployment requirements"""
    required_files = [
        'public/index.html',
        'public/index-en.html',
        'deployment_test_server.py'
    ]
    
    for file_path in required_files:
        if not os.path.exists(file_path):
            print(f"❌ Missing required file: {file_path}")
            return False
    
    print("✅ All deployment files present")
    return True

if __name__ == "__main__":
    if validate_deployment():
        print("✅ Deployment validation passed")
        print(f"📡 Configuration: {get_deployment_config()}")
    else:
        print("❌ Deployment validation failed")
        sys.exit(1)