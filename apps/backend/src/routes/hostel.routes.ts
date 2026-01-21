import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// Validation schemas
const createHostelSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  plan: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
  settings: z.object({
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),
    currency: z.string().default('USD'),
    timezone: z.string().default('UTC'),
  }).optional(),
});

const updateHostelSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
  plan: z.enum(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
  isActive: z.boolean().optional(),
  settings: z.object({
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),
    currency: z.string().optional(),
    timezone: z.string().optional(),
    lateCheckoutFee: z.number().optional(),
    cancellationPolicy: z.string().optional(),
  }).optional(),
});

// Get all hostels (NO PERMISSION CHECK - Development only)
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { slug: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [hostels, total] = await Promise.all([
      prisma.hostel.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: true,
              rooms: true,
              bookings: true,
            },
          },
        },
      }),
      prisma.hostel.count({ where: whereClause }),
    ]);

    res.json({
      hostels,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get hostels error:', error);
    res.status(500).json({ error: 'Failed to fetch hostels', message: error.message });
  }
});

// Get current user's hostel
router.get('/my-hostel', authenticate, async (req: any, res) => {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: { id: req.user.hostelId },
      include: {
        _count: {
          select: {
            users: true,
            rooms: true,
            bookings: true,
            guests: true,
          },
        },
      },
    });

    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    // Calculate some stats
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [monthlyRevenue, todayBookings, availableRooms] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          hostelId: hostel.id,
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.booking.count({
        where: {
          hostelId: hostel.id,
          createdAt: {
            gte: new Date(today.setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.room.count({
        where: {
          hostelId: hostel.id,
          isAvailable: true,
        },
      }),
    ]);

    const stats = {
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      todayBookings,
      availableRooms,
      totalRooms: hostel._count.rooms,
      totalGuests: hostel._count.guests,
      totalBookings: hostel._count.bookings,
      totalStaff: hostel._count.users,
    };

    res.json({
      hostel,
      stats,
    });
  } catch (error: any) {
    console.error('Get hostel error:', error);
    res.status(500).json({ error: 'Failed to fetch hostel', message: error.message });
  }
});

// Get hostel by ID (NO PERMISSION CHECK - Development only)
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;

    const hostel = await prisma.hostel.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            rooms: true,
            bookings: true,
            guests: true,
          },
        },
      },
    });

    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    res.json({ hostel });
  } catch (error: any) {
    console.error('Get hostel by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch hostel', message: error.message });
  }
});

// Create new hostel (NO PERMISSION CHECK - Development only)
router.post('/', authenticate, async (req: any, res) => {
  try {
    const validatedData = createHostelSchema.parse(req.body);

    // Check if hostel slug is unique
    const existingHostel = await prisma.hostel.findUnique({
      where: { slug: validatedData.slug }
    });
    
    if (existingHostel) {
      return res.status(400).json({ error: 'Hostel slug already taken' });
    }

    const hostel = await prisma.hostel.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        plan: validatedData.plan || 'FREE',
        settings: validatedData.settings || {},
      }
    });

    res.status(201).json({
      message: 'Hostel created successfully',
      hostel,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Create hostel error:', error);
    res.status(500).json({ error: 'Failed to create hostel', message: error.message });
  }
});

// Update hostel (NO PERMISSION CHECK - Development only)
router.put('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;

    const validatedData = updateHostelSchema.parse(req.body);

    // If updating slug, check if it's unique
    if (validatedData.slug) {
      const existingHostel = await prisma.hostel.findUnique({
        where: { slug: validatedData.slug },
      });
      if (existingHostel && existingHostel.id !== id) {
        return res.status(400).json({ error: 'Hostel slug already taken' });
      }
    }

    const updatedHostel = await prisma.hostel.update({
      where: { id },
      data: validatedData,
    });

    res.json({
      message: 'Hostel updated successfully',
      hostel: updatedHostel,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Update hostel error:', error);
    res.status(500).json({ error: 'Failed to update hostel', message: error.message });
  }
});

// Delete hostel (NO PERMISSION CHECK - Development only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if hostel exists
    const hostel = await prisma.hostel.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            rooms: true,
            bookings: true,
          },
        },
      },
    });

    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    // Delete the hostel
    await prisma.hostel.delete({
      where: { id },
    });

    res.json({
      message: 'Hostel deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete hostel error:', error);
    res.status(500).json({ error: 'Failed to delete hostel', message: error.message });
  }
});

// Update hostel status (NO PERMISSION CHECK - Development only)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const updatedHostel = await prisma.hostel.update({
      where: { id },
      data: { isActive },
    });

    res.json({
      message: `Hostel ${isActive ? 'activated' : 'deactivated'} successfully`,
      hostel: updatedHostel,
    });
  } catch (error: any) {
    console.error('Update hostel status error:', error);
    res.status(500).json({ error: 'Failed to update hostel status', message: error.message });
  }
});

// Get hostel statistics (NO PERMISSION CHECK - Development only)
router.get('/:id/stats', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      monthlyRevenue,
      yearlyRevenue,
      occupancyRate,
      totalGuests,
      activeBookings,
      roomTypes,
      monthlyBookingsTrend,
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          hostelId: id,
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          hostelId: id,
          status: 'COMPLETED',
          createdAt: { gte: startOfYear },
        },
        _sum: { amount: true },
      }),
      (async () => {
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const bookings = await prisma.booking.findMany({
          where: {
            hostelId: id,
            checkIn: { gte: thirtyDaysAgo },
            checkOut: { lte: today },
          },
          select: {
            checkIn: true,
            checkOut: true,
            roomId: true,
          },
        });

        const totalRoomNights = bookings.reduce((sum, booking) => {
          const nights = Math.ceil(
            (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + nights;
        }, 0);

        const totalRooms = await prisma.room.count({ where: { hostelId: id } });
        const possibleRoomNights = totalRooms * 30;
        
        return possibleRoomNights > 0 ? (totalRoomNights / possibleRoomNights) * 100 : 0;
      })(),
      prisma.guest.count({ where: { hostelId: id } }),
      prisma.booking.count({
        where: {
          hostelId: id,
          OR: [
            { status: 'CHECKED_IN' },
            { status: 'CONFIRMED', checkIn: { gte: today } },
          ],
        },
      }),
      prisma.room.groupBy({
        by: ['type'],
        where: { hostelId: id },
        _count: true,
      }),
      (async () => {
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        
        const bookings = await prisma.booking.groupBy({
          by: ['createdAt'],
          where: {
            hostelId: id,
            createdAt: { gte: sixMonthsAgo },
          },
          _count: true,
        });

        const monthlyData = bookings.reduce((acc: any, booking) => {
          const month = booking.createdAt.toISOString().slice(0, 7);
          acc[month] = (acc[month] || 0) + booking._count;
          return acc;
        }, {});

        return Object.entries(monthlyData).map(([month, count]) => ({
          month,
          bookings: count,
        }));
      })(),
    ]);

    res.json({
      stats: {
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        yearlyRevenue: yearlyRevenue._sum.amount || 0,
        occupancyRate: Math.round(occupancyRate * 100) / 100,
        totalGuests,
        activeBookings,
        roomTypes: roomTypes.map(rt => ({
          type: rt.type,
          count: rt._count,
        })),
        monthlyBookingsTrend,
      },
    });
  } catch (error: any) {
    console.error('Get hostel stats error:', error);
    res.status(500).json({ error: 'Failed to fetch hostel statistics', message: error.message });
  }
});

// Create new hostel (NO PERMISSION CHECK - Development only)
router.post('/', authenticate, async (req: any, res) => {
  try {
    const validatedData = createHostelSchema.parse(req.body);

    // Check if hostel slug is unique
    const existingHostel = await prisma.hostel.findUnique({
      where: { slug: validatedData.slug }
    });
    
    if (existingHostel) {
      return res.status(400).json({ error: 'Hostel slug already taken' });
    }

    const hostel = await prisma.hostel.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        plan: validatedData.plan || 'FREE',
        settings: validatedData.settings || {},
      }
    });

    res.status(201).json({
      message: 'Hostel created successfully',
      hostel,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Create hostel error:', error);
    res.status(500).json({ error: 'Failed to create hostel', message: error.message });
  }
});

export default router;