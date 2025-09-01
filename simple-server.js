const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = Number(process.env.PORT) || 5000;

// Sample data for testing
const stores = [
  {
    id: "store-001",
    storeName: "沖縄そば屋 はな",
    email: "hana@example.com",
    status: "active",
    registrationDate: new Date().toISOString(),
    totalViews: 15,
    totalBookings: 3,
    averageRating: 4.5
  },
  {
    id: "store-002", 
    storeName: "海辺カフェ BlueWave",
    email: "bluewave@example.com",
    status: "active",
    registrationDate: new Date().toISOString(),
    totalViews: 25,
    totalBookings: 5,
    averageRating: 4.8
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
    date: "2025-09-15",
    time: "14:00",
    duration: 2,
    totalAmount: 6000
  }
];

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return types[ext] || 'text/plain';
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
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

  if (pathname === '/api/sponsor-stores') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stores));
    return;
  }

  if (pathname === '/api/tourism-guides') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(guides));
    return;
  }

  if (pathname === '/api/reservations') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reservations));
    return;
  }

  // Static file serving
  let filePath = pathname === '/' ? '/public/index.html' : '/public' + pathname;
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Not Found',
        message: 'The requested resource does not exist',
        availableEndpoints: ['/api', '/health', '/api/sponsor-stores', '/api/tourism-guides', '/api/reservations']
      }));
      return;
    }

    const contentType = getContentType(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TomoTrip Server running on port ${PORT}`);
  console.log(`📊 Data stored in memory - stores: ${stores.length}, guides: ${guides.length}, reservations: ${reservations.length}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api`);
});