#!/usr/bin/env python3
"""
Deployment compatibility test script
Tests if TomoTrip can be deployed successfully
"""
import subprocess
import sys
import os
import time

def test_deployment():
    print("🔍 TomoTrip Deployment Test")
    print("=" * 40)
    
    # Test 1: Python availability
    try:
        result = subprocess.run([sys.executable, '--version'], 
                              capture_output=True, text=True)
        print(f"✅ Python: {result.stdout.strip()}")
    except Exception as e:
        print(f"❌ Python test failed: {e}")
        return False
    
    # Test 2: Required files
    required_files = ['main.py', 'index.html', 'replit.toml']
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ File found: {file}")
        else:
            print(f"❌ Missing file: {file}")
            return False
    
    # Test 3: Server startup test
    try:
        print("🚀 Testing server startup...")
        process = subprocess.Popen([sys.executable, 'main.py'], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE,
                                 text=True)
        time.sleep(3)  # Give server time to start
        
        if process.poll() is None:  # Still running
            print("✅ Server started successfully")
            process.terminate()
            process.wait()
            return True
        else:
            stdout, stderr = process.communicate()
            print(f"❌ Server failed to start: {stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Server test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_deployment()
    if success:
        print("\n🎉 Deployment test PASSED - Ready for production!")
        sys.exit(0)
    else:
        print("\n💥 Deployment test FAILED - Needs fixing")
        sys.exit(1)
