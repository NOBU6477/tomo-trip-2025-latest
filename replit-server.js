const http = require('http');
const fs = require('fs');
const path = require('path');

// Replit-optimized server configuration
const PORT = 5000;
const HOST = '0.0.0.0';

console.log('🚀 Starting Replit-optimized server...');

const server = http.createServer((req, res) => {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'OK', 
      server: 'Replit-Optimized',
      timestamp: new Date().toISOString() 
    }));
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.mjs': 'text/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Explicit server binding for Replit compatibility
server.listen(PORT, HOST, () => {
  console.log(`✅ Replit Server READY on ${HOST}:${PORT}`);
  console.log(`REPLIT_PORT_READY:${PORT}`);
  console.log(`PORT_${PORT}_OPEN`);
  console.log(`REPLIT_READY`);
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('🔄 Graceful shutdown...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});