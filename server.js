// TomoTrip Server Bridge
// This Node.js file bridges .replit configuration to Python server

const { spawn } = require('child_process');

console.log('🌐 TomoTrip Server Bridge starting...');

// Start the Python server
const pythonProcess = spawn('python3', ['main.py'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

// Handle process events
pythonProcess.on('error', (error) => {
  console.error('❌ Python server error:', error.message);
  process.exit(1);
});

pythonProcess.on('exit', (code, signal) => {
  console.log(`🛑 Python server exited with code ${code}, signal ${signal}`);
  process.exit(code || 0);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down TomoTrip server...');
  pythonProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Terminating TomoTrip server...');
  pythonProcess.kill('SIGTERM');
});

console.log('✅ Server bridge established, Python server starting on port 5000');