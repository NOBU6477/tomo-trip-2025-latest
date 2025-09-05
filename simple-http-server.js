const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
    return;
  }

  // API info
  if (req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ name: 'TomoTrip Simple Server', version: '1.0.0' }));
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);

  // Security check
  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1>');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(`File not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.mjs': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    
    const contentType = mimeTypes[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Improved error handling and port binding with Replit compatibility
server.listen(PORT, HOST, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  
  console.log(`✅ TomoTrip Server running on http://${HOST}:${PORT}`);
  console.log(`🌐 Website: http://localhost:${PORT}/`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`🚀 Server listening on ${HOST}:${PORT}`);
  
  // Special Replit port detection signal
  console.log(`REPLIT_PORT_READY:${PORT}`);
  
  // Test self-connection to ensure server is actually working
  setTimeout(() => {
    const testReq = http.request(`http://localhost:${PORT}/health`, (res) => {
      console.log(`🧪 Self-test: HTTP ${res.statusCode}`);
      console.log(`🎯 Server is ready and accepting connections on port ${PORT}`);
      
      // Additional Replit signals
      console.log(`PORT_${PORT}_OPEN`);
      console.log(`REPLIT_READY`);
    });
    testReq.on('error', (err) => {
      console.error('🚨 Self-test failed:', err.message);
    });
    testReq.end();
    
    // Test main page
    setTimeout(() => {
      const mainReq = http.request(`http://localhost:${PORT}/`, (res) => {
        console.log(`🏠 Main page test: HTTP ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log(`APP_READY_ON_PORT_${PORT}`);
        }
      });
      mainReq.on('error', (err) => {
        console.error('🚨 Main page test failed:', err.message);
      });
      mainReq.end();
    }, 500);
  }, 1000);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} is already in use. Trying to kill existing process...`);
    // Try a different port or restart
    process.exit(1);
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});