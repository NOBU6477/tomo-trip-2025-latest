#!/bin/bash
if command -v python3 &> /dev/null; then
    echo "Starting server with Python3..."
    python3 -m http.server 5000
elif command -v python &> /dev/null; then
    echo "Starting server with Python..."
    python -m SimpleHTTPServer 5000
else
    echo "No Python found, trying alternative..."
    # Create a minimal HTML server using available tools
    exec 3<>/dev/tcp/0.0.0.0/5000 2>/dev/null || {
        echo "Starting minimal server on port 5000..."
        while true; do
            echo -e "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n$(cat index-complete.html)" | nc -l -p 5000
        done
    }
fi