const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Helper function to get content type
function getContentType(filePath) {
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
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  };
  return mimeTypes[ext] || 'text/plain';
}

// In-memory storage for demo
const stores = [
  {
    id: "store-001",
    storeName: "沖縄そば屋 はな",
    email: "hana@example.com",
    status: "active",
    registrationDate: new Date().toISOString(),
    totalViews: 15,
    totalBookings: 3,
    averageRating: 4.5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "store-002",
    storeName: "海辺カフェ BlueWave",
    email: "bluewave@example.com",
    status: "active",
    registrationDate: new Date().toISOString(),
    totalViews: 25,
    totalBookings: 5,
    averageRating: 4.8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const guides = [
  {
    id: "guide-001",
    storeId: "store-001",
    name: "田中 花子",
    languages: ["日本語", "English"],
    specialties: ["沖縄料理", "文化体験"],
    rating: 4.5,
    hourlyRate: 3000
  },
  {
    id: "guide-002",
    storeId: "store-002",
    name: "山田 太郎",
    languages: ["日本語", "English", "中文"],
    specialties: ["カフェ文化", "海辺散策"],
    rating: 4.8,
    hourlyRate: 3500
  }
];

const reservations = [
  {
    id: "res-001",
    storeId: "store-001",
    guideId: "guide-001",
    clientName: "Smith John",
    status: "confirmed",
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Root route - serve index.html
  if (pathname === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File not found</h1>');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // Health check endpoint
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: {
        stores: stores.length,
        guides: guides.length,
        reservations: reservations.length,
        status: 'connected'
      },
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }));
    return;
  }

  // API info endpoint
  if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: 'TomoTrip API Server',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        stores: '/api/sponsor-stores',
        guides: '/api/tourism-guides',
        reservations: '/api/reservations',
        health: '/health'
      },
      database: {
        stores: stores.length,
        guides: guides.length,
        reservations: reservations.length
      }
    }));
    return;
  }

  // API endpoints
  if (pathname === '/api/sponsor-stores' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stores));
    return;
  }

  if (pathname === '/api/tourism-guides' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(guides));
    return;
  }

  if (pathname === '/api/reservations' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reservations));
    return;
  }

  // Static file serving
  let filePath = path.join(__dirname, 'public', pathname);
  
  // Security check - prevent directory traversal
  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File not found</h1>');
      return;
    }

    const contentType = getContentType(filePath);
    res.writeHead(200, { 'Content-Type': contentType });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`TomoTrip Web Server running on port ${PORT}`);
  console.log(`📊 Data stored in memory - stores: ${stores.length}, guides: ${guides.length}, reservations: ${reservations.length}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api`);
  console.log(`🌐 Website: http://localhost:${PORT}/`);
});