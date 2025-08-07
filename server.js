#!/usr/bin/env node
/**
 * TomoTrip - Node.js to Python Bridge
 * Immediate redirect to Python server
 */

console.log('🌐 TomoTrip Node.js Bridge - Starting Python Server');

const { spawn } = require('child_process');

// Start Python server immediately
const pythonProcess = spawn('python3', ['main.py'], { 
  stdio: 'inherit',
  detached: true 
});

pythonProcess.on('error', (err) => {
  console.error('Failed to start Python server:', err);
  process.exit(1);
});

// Keep Node.js process alive
process.on('SIGINT', () => {
  pythonProcess.kill();
  process.exit(0);
});

// Check if Node.js child_process is available
try {
  const { spawn } = require('child_process');
  
  // Start Python server with proper error handling and path resolution
  const pythonCommand = process.env.PYTHON_CMD || 'python3';
  const pythonProcess = spawn(pythonCommand, ['main.py'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { 
      ...process.env, 
      PORT: '5000',
      PATH: process.env.PATH + ':/usr/bin:/bin'
    }
  });

  pythonProcess.on('error', (error) => {
    console.error('❌ Bridge error:', error.message);
    console.log('🔄 Falling back to direct Python execution...');
    process.exit(1);
  });

  pythonProcess.on('exit', (code) => {
    console.log(`🛑 Python server exited with code ${code}`);
    process.exit(code || 0);
  });

  // Signal handling
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      console.log(`\n🛑 Received ${signal} - shutting down...`);
      pythonProcess.kill(signal);
    });
  });

  console.log('✅ Bridge established - Python server starting on port 5000');
  
} catch (error) {
  console.error('❌ Node.js bridge failed:', error.message);
  console.log('🔄 Please run: python3 main.py');
  process.exit(1);
}