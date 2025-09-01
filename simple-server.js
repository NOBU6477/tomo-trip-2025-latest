const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// In-memory storage for demo
let stores = [
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

let guides = [
  {
    id: "guide-001",
    guideName: "山田 太郎",
    storeId: "store-001",
    status: "pending",
    totalBookings: 0,
    averageRating: 0.0,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "guide-002",
    guideName: "佐藤 花子",
    storeId: "store-002",
    status: "pending",
    totalBookings: 2,
    averageRating: 4.3,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let reservations = [
  {
    id: "res-001",
    storeId: "store-001",
    guideId: "guide-001",
    customerName: "John Doe",
    status: "confirmed",
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper function to get content type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return mimeTypes[ext] || 'text/plain';
}

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

  // Root endpoint - API status
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("TomoTrip API is running");
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

  // 404 handler
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not Found',
    message: 'The requested resource does not exist',
    availableEndpoints: ['/api', '/health', '/api/sponsor-stores', '/api/tourism-guides', '/api/reservations']
  }));
});

server.listen(Number(process.env.PORT) || 5000, "0.0.0.0", () => {
  console.log(`TomoTrip Server running on port ${Number(process.env.PORT) || 5000}`);
  console.log(`📊 Data stored in memory - stores: ${stores.length}, guides: ${guides.length}, reservations: ${reservations.length}`);
  console.log(`🔍 Health check: http://localhost:${Number(process.env.PORT) || 5000}/health`);
  console.log(`📖 API info: http://localhost:${Number(process.env.PORT) || 5000}/api`);
});