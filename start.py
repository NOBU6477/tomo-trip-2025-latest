#!/nix/store/h097imm3w6dpx10qynrd2sz9fks2wbq8-python3-3.12.11/bin/python3
"""
Alternative startup bypassing .replit errors
"""
import os
import signal
import subprocess
import sys

def signal_handler(sig, frame):
    print("\n🛑 Server shutdown requested")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

print("🌴 TomoTrip Alternative Startup")
print("Bypassing .replit configuration errors...")

# Try to run main.py directly
try:
    subprocess.run([
        '/nix/store/h097imm3w6dpx10qynrd2sz9fks2wbq8-python3-3.12.11/bin/python3', 
        'main.py'
    ])
except KeyboardInterrupt:
    print("\n✅ Server stopped")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)