// Simple test server to verify basic functionality
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || process.env.REPLIT_PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

console.log('🧪 Starting test server...');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Test server running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API test endpoint working',
    server: 'test-server'
  });
});

app.listen(PORT, HOST, () => {
  console.log(`✅ Test Server READY on ${HOST}:${PORT}`);
  console.log(`REPLIT_PORT_READY:${PORT}`);
  console.log(`PORT_${PORT}_OPEN`);
  console.log(`REPLIT_READY`);
});