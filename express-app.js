const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
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

// In-memory storage for demo (replace with database in production)
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


// Generate UUID
function generateUUID() {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function() {
    return Math.floor(Math.random() * 16).toString(16);
  });
}

// API Routes
// Sponsor Store endpoints
app.post('/api/sponsor-stores', (req, res) => {
  try {
    const storeData = req.body;
    
    // Check if store already exists
    const existingStore = stores.find(s => s.email === storeData.email);
    if (existingStore) {
      return res.status(409).json({ error: 'Store with this email already exists' });
    }
    
    // Create new store with UUID
    const newStore = {
      id: generateUUID(),
      ...storeData,
      status: 'active',
      registrationDate: new Date().toISOString(),
      totalViews: 0,
      totalBookings: 0,
      averageRating: 0.00,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    stores.push(newStore);
    console.log('✅ Store created with ID:', newStore.id, 'Name:', newStore.storeName);
    
    res.status(201).json(newStore);
  } catch (error) {
    console.error('Error creating sponsor store:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
});

app.get('/api/sponsor-stores/:id', (req, res) => {
  try {
    const store = stores.find(s => s.id === req.params.id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

app.get('/api/sponsor-stores', (req, res) => {
  try {
    res.json(stores.filter(s => s.isActive));
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

app.put('/api/sponsor-stores/:id', (req, res) => {
  try {
    const storeIndex = stores.findIndex(s => s.id === req.params.id);
    if (storeIndex === -1) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const updatedData = req.body;
    stores[storeIndex] = {
      ...stores[storeIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Store updated:', stores[storeIndex].storeName);
    res.json(stores[storeIndex]);
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
});

// Tourism Guide endpoints
app.post('/api/tourism-guides', (req, res) => {
  try {
    const guideData = req.body;
    
    const newGuide = {
      id: generateUUID(),
      ...guideData,
      status: 'pending',
      totalBookings: 0,
      averageRating: 0.00,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    guides.push(newGuide);
    console.log('✅ Guide created with ID:', newGuide.id, 'Name:', newGuide.guideName);
    
    res.status(201).json(newGuide);
  } catch (error) {
    console.error('Error creating tourism guide:', error);
    res.status(500).json({ error: 'Failed to create guide' });
  }
});

app.get('/api/tourism-guides/store/:storeId', (req, res) => {
  try {
    const storeGuides = guides.filter(g => g.storeId === req.params.storeId && g.isAvailable);
    res.json(storeGuides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
});

// Reservation endpoints
app.post('/api/reservations', (req, res) => {
  try {
    const reservationData = req.body;
    
    const newReservation = {
      id: generateUUID(),
      ...reservationData,
      status: 'confirmed',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    reservations.push(newReservation);
    console.log('✅ Reservation created with ID:', newReservation.id);
    
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

app.get('/api/reservations/store/:storeId', (req, res) => {
  try {
    const storeReservations = reservations.filter(r => r.storeId === req.params.storeId);
    res.json(storeReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Static file serving
app.use(express.static('public'));

// Default route - API status
app.get('/', (req, res) => {
  res.status(200).send("TomoTrip API is running");
});

// Health check endpoint for monitoring
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

// API info endpoint
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: ['/api', '/health', '/api/sponsor-stores', '/api/tourism-guides', '/api/reservations']
  });
});

app.listen(Number(process.env.PORT) || 5000, "0.0.0.0", () => {
  console.log(`TomoTrip Server running on port ${Number(process.env.PORT) || 5000}`);
  console.log(`📊 Data stored in memory - stores: ${stores.length}, guides: ${guides.length}, reservations: ${reservations.length}`);
  console.log(`🔍 Health check: http://localhost:${Number(process.env.PORT) || 5000}/health`);
  console.log(`📖 API info: http://localhost:${Number(process.env.PORT) || 5000}/api`);
});