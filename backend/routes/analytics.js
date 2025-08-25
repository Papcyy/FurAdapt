import express from 'express';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import AdoptionRequest from '../models/AdoptionRequest.js';
import ChatMessage from '../models/ChatMessage.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Basic counts
    const totalPets = await Pet.countDocuments();
    const availablePets = await Pet.countDocuments({ status: 'available' });
    const adoptedPets = await Pet.countDocuments({ status: 'adopted' });
    const pendingAdoptions = await Pet.countDocuments({ status: 'pending' });

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalRequests = await AdoptionRequest.countDocuments();
    const pendingRequests = await AdoptionRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await AdoptionRequest.countDocuments({ status: 'approved' });

    // Monthly stats
    const petsAddedThisMonth = await Pet.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const adoptionsThisMonth = await Pet.countDocuments({
      status: 'adopted',
      adoptedAt: { $gte: startOfMonth }
    });

    const requestsThisMonth = await AdoptionRequest.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const usersRegisteredThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Adoption rate
    const adoptionRate = totalPets > 0 ? ((adoptedPets / totalPets) * 100).toFixed(1) : 0;

    // Species distribution
    const speciesDistribution = await Pet.aggregate([
      {
        $group: {
          _id: '$species',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Monthly adoption trends (last 6 months)
    const monthlyTrends = await Pet.aggregate([
      {
        $match: {
          status: 'adopted',
          adoptedAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$adoptedAt' },
            month: { $month: '$adoptedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Recent activities
    const recentAdoptions = await Pet.find({ status: 'adopted' })
      .populate('adoptedBy', 'name')
      .sort({ adoptedAt: -1 })
      .limit(5)
      .select('name species adoptedAt adoptedBy');

    const recentRequests = await AdoptionRequest.find()
      .populate([
        { path: 'pet', select: 'name species' },
        { path: 'adopter', select: 'name' }
      ])
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      overview: {
        totalPets,
        availablePets,
        adoptedPets,
        pendingAdoptions,
        totalUsers,
        totalAdmins,
        totalRequests,
        pendingRequests,
        approvedRequests,
        adoptionRate
      },
      monthly: {
        petsAddedThisMonth,
        adoptionsThisMonth,
        requestsThisMonth,
        usersRegisteredThisMonth
      },
      charts: {
        speciesDistribution,
        monthlyTrends
      },
      recent: {
        adoptions: recentAdoptions,
        requests: recentRequests
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get pet analytics
// @route   GET /api/analytics/pets
// @access  Private (Admin)
router.get('/pets', protect, admin, async (req, res) => {
  try {
    // Age distribution
    const ageDistribution = await Pet.aggregate([
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 1, 3, 7, 12],
          default: '12+',
          output: {
            count: { $sum: 1 },
            avgAdoptionFee: { $avg: '$adoptionFee' }
          }
        }
      }
    ]);

    // Size distribution
    const sizeDistribution = await Pet.aggregate([
      {
        $group: {
          _id: '$size',
          count: { $sum: 1 },
          avgAdoptionFee: { $avg: '$adoptionFee' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Status distribution
    const statusDistribution = await Pet.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Average time to adoption
    const adoptionTimes = await Pet.aggregate([
      {
        $match: { status: 'adopted', adoptedAt: { $exists: true } }
      },
      {
        $project: {
          daysToAdoption: {
            $divide: [
              { $subtract: ['$adoptedAt', '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDaysToAdoption: { $avg: '$daysToAdoption' },
          minDaysToAdoption: { $min: '$daysToAdoption' },
          maxDaysToAdoption: { $max: '$daysToAdoption' }
        }
      }
    ]);

    res.json({
      ageDistribution,
      sizeDistribution,
      statusDistribution,
      adoptionTimes: adoptionTimes[0] || {
        avgDaysToAdoption: 0,
        minDaysToAdoption: 0,
        maxDaysToAdoption: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private (Admin)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // User registration trends
    const registrationTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Active users (users who have sent messages or made requests recently)
    const activeUsers = await User.aggregate([
      {
        $lookup: {
          from: 'adoptionrequests',
          localField: '_id',
          foreignField: 'adopter',
          as: 'requests'
        }
      },
      {
        $lookup: {
          from: 'chatmessages',
          localField: '_id',
          foreignField: 'sender',
          as: 'messages'
        }
      },
      {
        $match: {
          $or: [
            { 'requests.createdAt': { $gte: last30Days } },
            { 'messages.createdAt': { $gte: last30Days } }
          ]
        }
      },
      {
        $count: 'activeUserCount'
      }
    ]);

    // User role distribution
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      registrationTrends,
      activeUserCount: activeUsers[0]?.activeUserCount || 0,
      roleDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
