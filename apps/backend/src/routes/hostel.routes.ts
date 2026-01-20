import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, authorize } from '../middleware/auth';

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
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(), // Add this line
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

// Get all hostels (Super Admin only)
router.get('/', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
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
      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          hostelId: hostel.id,
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      // Today's bookings
      prisma.booking.count({
        where: {
          hostelId: hostel.id,
          createdAt: {
            gte: new Date(today.setHours(0, 0, 0, 0)),
          },
        },
      }),
      // Available rooms
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

// Get hostel by ID (Super Admin or hostel member)
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has access to this hostel
    if (req.user.role !== 'SUPER_ADMIN' && req.user.hostelId !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

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

// Update hostel
router.put('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has access to this hostel
    if (req.user.role !== 'SUPER_ADMIN' && req.user.hostelId !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const validatedData = updateHostelSchema.parse(req.body);

    // Check if trying to update slug (only SUPER_ADMIN can do this)
    if (validatedData.slug && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Only super admins can change hostel slug' });
    }

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

// Deactivate/reactivate hostel (Super Admin only)
router.patch('/:id/status', authenticate, authorize(['SUPER_ADMIN']), async (req, res) => {
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

// Get hostel statistics
router.get('/:id/stats', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has access to this hostel
    if (req.user.role !== 'SUPER_ADMIN' && req.user.hostelId !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

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
      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          hostelId: id,
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      // Yearly revenue
      prisma.payment.aggregate({
        where: {
          hostelId: id,
          status: 'COMPLETED',
          createdAt: { gte: startOfYear },
        },
        _sum: { amount: true },
      }),
      // Occupancy rate (last 30 days)
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

        // Simple occupancy calculation
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
      // Total guests
      prisma.guest.count({ where: { hostelId: id } }),
      // Active bookings (checked in or confirmed for future)
      prisma.booking.count({
        where: {
          hostelId: id,
          OR: [
            { status: 'CHECKED_IN' },
            { status: 'CONFIRMED', checkIn: { gte: today } },
          ],
        },
      }),
      // Room type distribution
      prisma.room.groupBy({
        by: ['type'],
        where: { hostelId: id },
        _count: true,
      }),
      // Monthly bookings trend (last 6 months)
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

        // Group by month
        const monthlyData = bookings.reduce((acc: any, booking) => {
          const month = booking.createdAt.toISOString().slice(0, 7); // YYYY-MM
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
        occupancyRate: Math.round(occupancyRate * 100) / 100, // Round to 2 decimal places
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

export default router;
