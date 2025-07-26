#!/usr/bin/env python3
"""
Alternative entry point for deployment
"""
import subprocess
import sys

if __name__ == "__main__":
    subprocess.run([sys.executable, "main.py"])