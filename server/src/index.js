const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const next = require('next');

const config = require('./config/env');
const { connectDB } = require('./config/db');
const { initSocket } = require('./config/socket');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const commodityRoutes = require('./routes/commodityRoutes');
const materialRoutes = require('./routes/materialRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Auto-seed check
const Commodity = require('./models/Commodity');
const seedDatabase = require('./seed/seedData');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Security and utility middleware (configured for iframe preview support)
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Cross-Origin-Resource-Policy');
  next();
});
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(compression());
app.use(express.static(path.resolve(__dirname, '../../client/public')));

// Parse JSON and form bodies only for /api requests to avoid interfering with Next.js streams
app.use('/api', express.json({ limit: '10mb' }));
app.use('/api', express.urlencoded({ extended: true, limit: '10mb' }));

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiter for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'MoFPI Intelligent Food Packaging Recommendation Engine',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/commodities', commodityRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Database offline / fallback error handling from Phase 2.2
app.use((err, req, res, next) => {
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    (err.message && err.message.includes('buffering timed out'))
  ) {
    console.warn('[AI Studio] Database offline — returning mock response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }
  next(err);
});

// Next.js Integration
const isDev = config.NODE_ENV !== 'production';
const nextApp = next({
  dev: isDev,
  dir: path.resolve(__dirname, '../../client'),
});
const handle = nextApp.getRequestHandler();

// Next.js handles all non-API routes
app.all('*', (req, res) => {
  return handle(req, res);
});

// Global Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const count = await Commodity.countDocuments();
    if (count === 0) {
      console.log('[Server] Database is empty. Running initial seed data...');
      await seedDatabase();
    }

    console.log('[Server] Preparing Next.js application...');
    await nextApp.prepare();
    console.log('[Server] Next.js prepared successfully.');

    server.listen(config.PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(`🚀 MoFPI Food Packaging AI Server running on http://0.0.0.0:${config.PORT}`);
      console.log(`🧪 Environment: ${config.NODE_ENV}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
