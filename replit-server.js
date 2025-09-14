const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Import our new API services
const { guideAPIService } = require('./server/guideAPI');
const { adminAuthService } = require('./server/adminAuth');

// Replit-optimized server configuration
const PORT = process.env.PORT || process.env.REPLIT_PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

console.log('🚀 Starting TomoTrip integrated server...');

// Create Express app
const app = express();

// Middleware setup - Allow all origins for development (fix CORS issues)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow all replit.dev domains and localhost
    const allowedPatterns = [
      /^https:\/\/.*\.replit\.dev$/,
      /^https:\/\/.*\.repl\.co$/,
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/
    ];
    
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      console.log(`✅ CORS allowed origin: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Fix .mjs MIME type for ES6 modules
app.use((req, res, next) => {
  if (req.path.endsWith('.mjs')) {
    res.type('application/javascript');
  }
  next();
});

// Rate limiting for admin login
app.use('/api/admin/login', adminAuthService.createLoginRateLimit());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'TomoTrip Integrated Server',
    timestamp: new Date().toISOString(),
    services: {
      sms: 'enabled',
      fileStorage: 'enabled',
      adminAuth: 'enabled',
      guideAPI: 'enabled'
    }
  });
});

// API Status endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'TomoTrip API Server',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      guides: '/api/guides',
      sms: '/api/guides/send-verification',
      upload: '/api/guides/upload-document',
      admin: '/api/admin',
      health: '/health'
    },
    features: {
      smsVerification: true,
      fileUpload: true,
      adminAuth: true,
      guideRegistration: true
    }
  });
});

// Admin authentication endpoints
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password, accessLevel } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    const result = await adminAuthService.authenticateAdmin(username, password, accessLevel, clientIP);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'ログイン成功',
        token: result.token,
        user: result.user
      });
    } else {
      res.status(401).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'ログイン処理中にエラーが発生しました'
    });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.json({
    success: true,
    message: 'ログアウトしました'
  });
});

app.get('/api/admin/verify', adminAuthService.requireAuth(), (req, res) => {
  res.json({
    success: true,
    user: req.adminUser,
    permissions: adminAuthService.getPermissions(req.adminUser.level)
  });
});

// Setup Guide API routes
guideAPIService.setupRoutes(app);

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    // Set cache control headers
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Explicit server binding for Replit compatibility
app.listen(PORT, HOST, () => {
  console.log(`✅ TomoTrip Integrated Server READY on ${HOST}:${PORT}`);
  console.log(`REPLIT_PORT_READY:${PORT}`);
  console.log(`PORT_${PORT}_OPEN`);
  console.log(`REPLIT_READY`);
  console.log('🎯 TomoTrip Complete System Services:');
  console.log('   • SMS Verification: Twilio integration');
  console.log('   • File Upload: Object storage ready');
  console.log('   • Admin Auth: JWT-based security');
  console.log('   • Guide API: Full registration system');
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('🔄 Graceful shutdown...');
  process.exit(0);
});