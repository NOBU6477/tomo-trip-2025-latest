// Replit deployment compatibility - redirect to Python server
const { spawn } = require('child_process');

console.log('🏝️ TomoTrip Local Guide - Starting Python Server...');

const python = spawn('python3', ['main.py']);

python.stdout.on('data', (data) => {
  console.log(`${data}`);
});

python.stderr.on('data', (data) => {
  console.error(`${data}`);
});

python.on('close', (code) => {
  console.log(`Python server exited with code ${code}`);
});

// Keep Node.js process alive
process.on('SIGINT', () => {
  python.kill();
  process.exit();
});