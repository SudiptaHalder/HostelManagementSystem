import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import prisma from './utils/prisma';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(limiter);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hostel SaaS API is running',
    timestamp: new Date().toISOString() 
  });
});

// Database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    // Test connection by querying database version
    const result = await prisma.$queryRaw`SELECT version()`;
    
    // Try to get hostel count
    const hostelCount = await prisma.hostel.count();
    
    res.json({ 
      status: 'Database connected successfully',
      database: 'PostgreSQL',
      hostelCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Hostel SaaS Backend is working!',
    version: '1.0.0',
    features: ['Multi-tenant', 'PostgreSQL', 'Prisma ORM', 'Authentication']
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}`);
  console.log(`🔐 Authentication endpoints: /api/auth/register, /api/auth/login, /api/auth/me`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
