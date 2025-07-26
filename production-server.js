const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Static files serving
app.use(express.static('.'));

// API health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ プロダクション対応サーバー起動: http://0.0.0.0:${PORT}`);
  console.log(`✓ 複数同時ユーザー対応: Express.js`);
  console.log(`✓ 管理センター機能: 有効`);
});