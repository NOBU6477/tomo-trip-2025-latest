const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'TomoTrip Web Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Catch all - serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TomoTrip Express Server running on port ${PORT}`);
  console.log(`🌐 Website: http://localhost:${PORT}/`);
});