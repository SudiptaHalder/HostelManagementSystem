import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  hostelName: z.string().min(2),
  hostelSlug: z.string().min(2).regex(/^[a-z0-9-]+$/),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Generate JWT token
const generateToken = (userId: string, hostelId: string, role: string) => {
  return jwt.sign(
    { userId, hostelId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

// Register endpoint (Hostel Owner Registration)
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if email already exists globally
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Check if hostel slug is unique
    const existingHostel = await prisma.hostel.findUnique({
      where: { slug: validatedData.hostelSlug }
    });
    
    if (existingHostel) {
      return res.status(400).json({ error: 'Hostel slug already taken' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create hostel first
    const hostel = await prisma.hostel.create({
      data: {
        name: validatedData.hostelName,
        slug: validatedData.hostelSlug,
        plan: 'FREE',
        isActive: true,
      }
    });
    
    // Create user (hostel owner/admin)
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        hostelId: hostel.id,
      }
    });
    
    // Generate token
    const token = generateToken(user.id, hostel.id, user.role);
    
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      hostel: {
        id: hostel.id,
        name: hostel.name,
        slug: hostel.slug,
        plan: hostel.plan,
      },
      token,
    });
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { hostel: true }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is disabled' });
    }
    
    // Check if hostel is active
    if (!user.hostel.isActive) {
      return res.status(401).json({ error: 'Hostel account is disabled' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user.id, user.hostelId, user.role);
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      hostel: {
        id: user.hostel.id,
        name: user.hostel.name,
        slug: user.hostel.slug,
        plan: user.hostel.plan,
      },
      token,
    });
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          hostel: {
            select: {
              id: true,
              name: true,
              slug: true,
              plan: true,
              isActive: true,
            }
          }
        }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      // Format response
      const response = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          hostel: user.hostel
        }
      };
      
      res.json(response);
      
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', message: error.message });
  }
});

export default router;
