#!/usr/bin/env python3
"""
TomoTrip Diagnostic Tool
Analyze current environment and deployment status
"""
import subprocess
import os
import sys

def check_server_status():
    print("🔍 TomoTrip Diagnostic Report")
    print("=" * 50)
    
    # Check Python processes
    try:
        result = subprocess.run(['ps', 'aux'], capture_output=True, text=True)
        python_processes = [line for line in result.stdout.split('\n') if 'python' in line and 'main.py' in line]
        print(f"🐍 Python processes: {len(python_processes)}")
        for proc in python_processes:
            print(f"   {proc}")
    except:
        print("❌ Could not check processes")
    
    # Check port 5000
    try:
        result = subprocess.run(['curl', '-s', '-w', '%{http_code}', 'http://localhost:5000/', '-o', '/dev/null'], 
                              capture_output=True, text=True)
        print(f"🌐 HTTP Status: {result.stdout}")
    except:
        print("❌ Could not check HTTP status")
    
    # Check .replit configuration
    try:
        with open('.replit', 'r') as f:
            replit_content = f.read()
            print(f"⚙️  .replit config:")
            print(f"   Run command: {replit_content.split('run = ')[1].split('\n')[0] if 'run = ' in replit_content else 'Not found'}")
    except:
        print("❌ Could not read .replit")
    
    # Check if files exist
    files_to_check = ['index.html', 'main.py', 'sponsor-registration.html']
    for file in files_to_check:
        exists = os.path.exists(file)
        print(f"📁 {file}: {'✅' if exists else '❌'}")

if __name__ == "__main__":
    check_server_status()