const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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

// API Routes
app.get('/health', (req, res) => {
  res.json({
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
  });
});

app.get('/api', (req, res) => {
  res.json({
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
  });
});

app.get('/api/sponsor-stores', (req, res) => {
  res.json(stores);
});

app.get('/api/tourism-guides', (req, res) => {
  res.json(guides);
});

app.get('/api/reservations', (req, res) => {
  res.json(reservations);
});

// Static file serving
app.use(express.static('public'));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: ['/api', '/health', '/api/sponsor-stores', '/api/tourism-guides', '/api/reservations']
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TomoTrip Server running on port ${PORT}`);
  console.log(`📊 Data stored in memory - stores: ${stores.length}, guides: ${guides.length}, reservations: ${reservations.length}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api`);
});