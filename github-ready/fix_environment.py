#!/nix/store/h097imm3w6dpx10qynrd2sz9fks2wbq8-python3-3.12.11/bin/python3
"""
TomoTrip Environment Recovery Script
Direct path to Python to bypass PATH issues
"""
import os
import sys
import subprocess

def main():
    print("🔧 TomoTrip Environment Recovery")
    print("=" * 40)
    
    # Force Python path
    python_path = "/nix/store/h097imm3w6dpx10qynrd2sz9fks2wbq8-python3-3.12.11/bin/python3"
    
    # Set environment
    os.environ['PORT'] = '5000'
    os.environ['PYTHONPATH'] = os.getcwd()
    
    try:
        print(f"🐍 Starting server with: {python_path}")
        subprocess.run([python_path, 'main.py'], check=True)
    except Exception as e:
        print(f"❌ Recovery failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()