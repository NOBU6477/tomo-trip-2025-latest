const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Static file serving
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'Express + TomoTrip'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({ 
    name: 'TomoTrip Express Server', 
    version: '1.0.0',
    framework: 'Express.js'
  });
});

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ TomoTrip Express Server running on http://0.0.0.0:${PORT}`);
  console.log(`🌐 Website: http://localhost:${PORT}/`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`🚀 Express server listening on 0.0.0.0:${PORT}`);
  
  // Replit port detection signals
  console.log(`REPLIT_PORT_READY:${PORT}`);
  console.log(`PORT_${PORT}_OPEN`);
  console.log(`REPLIT_READY`);
  console.log(`APP_READY_ON_PORT_${PORT}`);
});