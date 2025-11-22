import express from 'express';
import { body, validationResult } from 'express-validator';
import AdoptionRequest from '../models/AdoptionRequest.js';
import Pet from '../models/Pet.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create adoption request
// @route   POST /api/adoptions
// @access  Private
router.post('/', protect, [
  body('petId').notEmpty().withMessage('Pet ID is required'),
  body('applicationData.livingSpace').isIn(['apartment', 'house', 'farm']).withMessage('Invalid living space'),
  body('applicationData.experience').notEmpty().withMessage('Experience is required'),
  body('applicationData.reason').notEmpty().withMessage('Reason is required'),
  body('applicationData.workSchedule').notEmpty().withMessage('Work schedule is required'),
  body('applicationData.emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('applicationData.emergencyContact.phone').notEmpty().withMessage('Emergency contact phone is required'),
  body('applicationData.emergencyContact.relationship').notEmpty().withMessage('Emergency contact relationship is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { petId, applicationData } = req.body;

    // Check if pet exists and is available
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({ message: 'Pet is not available for adoption' });
    }

    // Check if user already has a pending request for this pet
    const existingRequest = await AdoptionRequest.findOne({
      pet: petId,
      adopter: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this pet' });
    }

    const adoptionRequest = await AdoptionRequest.create({
      pet: petId,
      adopter: req.user._id,
      applicationData
    });

    await adoptionRequest.populate([
      { path: 'pet', select: 'name species breed images' },
      { path: 'adopter', select: 'name email phone' }
    ]);

    res.status(201).json(adoptionRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all adoption requests (Admin) or user's requests
// @route   GET /api/adoptions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role !== 'admin') {
      filter.adopter = req.user._id;
    }

    // Add status filter if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await AdoptionRequest.find(filter)
      .populate([
        { path: 'pet', select: 'name species breed images location adoptionFee' },
        { path: 'adopter', select: 'name email phone' },
        { path: 'reviewedBy', select: 'name email' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AdoptionRequest.countDocuments(filter);

    res.json({
      requests,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRequests: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single adoption request
// @route   GET /api/adoptions/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id)
      .populate([
        { path: 'pet', select: 'name species breed images location adoptionFee' },
        { path: 'adopter', select: 'name email phone address' },
        { path: 'reviewedBy', select: 'name email' }
      ]);

    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Check if user can access this request
    if (req.user.role !== 'admin' && request.adopter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this request' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update adoption request status (Admin only)
// @route   PUT /api/adoptions/:id
// @access  Private (Admin)
router.put('/:id', protect, admin, [
  body('status').isIn(['pending', 'approved', 'rejected', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, adminNotes } = req.body;

    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    request.status = status;
    request.adminNotes = adminNotes || request.adminNotes;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();

    await request.save();

    // Update pet status if request is approved
    if (status === 'approved') {
      await Pet.findByIdAndUpdate(request.pet, {
        status: 'pending',
        adoptedBy: request.adopter
      });
    } else if (status === 'completed') {
      await Pet.findByIdAndUpdate(request.pet, {
        status: 'adopted',
        adoptedBy: request.adopter,
        adoptedAt: new Date()
      });
    } else if (status === 'rejected') {
      // Make pet available again if rejected
      await Pet.findByIdAndUpdate(request.pet, {
        status: 'available',
        adoptedBy: null
      });
    }

    await request.populate([
      { path: 'pet', select: 'name species breed images' },
      { path: 'adopter', select: 'name email phone' },
      { path: 'reviewedBy', select: 'name email' }
    ]);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get adoption requests for user's pets (pet owner)
// @route   GET /api/adoptions/my-pets-requests
// @access  Private
router.get('/my-pets-requests/all', protect, async (req, res) => {
  try {
    // Get all pets posted by this user
    const userPets = await Pet.find({ addedBy: req.user._id }).select('_id');
    const petIds = userPets.map(pet => pet._id);

    // Get adoption requests for these pets
    const requests = await AdoptionRequest.find({ pet: { $in: petIds } })
      .populate([
        { path: 'pet', select: 'name species breed images location adoptionFee' },
        { path: 'adopter', select: 'name email phone profileImage address' },
        { path: 'reviewedBy', select: 'name email' }
      ])
      .sort({ createdAt: -1 });

    res.json({
      requests,
      totalRequests: requests.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update adoption request status by pet owner
// @route   PUT /api/adoptions/:id/owner-action
// @access  Private
router.put('/:id/owner-action', protect, [
  body('action').isIn(['approve', 'reject']).withMessage('Invalid action')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { action, notes } = req.body;
    const request = await AdoptionRequest.findById(req.params.id).populate('pet');

    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Check if user is the pet owner
    if (request.pet.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized. You must be the pet owner.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only act on pending requests' });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    request.status = newStatus;
    request.adminNotes = notes || request.adminNotes;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();

    await request.save();

    // Update pet status
    if (newStatus === 'approved') {
      await Pet.findByIdAndUpdate(request.pet._id, {
        status: 'pending',
        adoptedBy: request.adopter
      });

      // Reject all other pending requests for this pet
      await AdoptionRequest.updateMany(
        {
          pet: request.pet._id,
          _id: { $ne: request._id },
          status: 'pending'
        },
        {
          status: 'rejected',
          adminNotes: 'Another adopter was approved for this pet',
          reviewedBy: req.user._id,
          reviewedAt: new Date()
        }
      );
    }

    await request.populate([
      { path: 'pet', select: 'name species breed images' },
      { path: 'adopter', select: 'name email phone' },
      { path: 'reviewedBy', select: 'name email' }
    ]);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark adoption as completed by pet owner
// @route   PUT /api/adoptions/:id/complete
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id).populate('pet');

    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Check if user is the pet owner
    if (request.pet.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized. You must be the pet owner.' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ message: 'Can only complete approved requests' });
    }

    request.status = 'completed';
    await request.save();

    // Update pet status to adopted
    await Pet.findByIdAndUpdate(request.pet._id, {
      status: 'adopted',
      adoptedAt: new Date()
    });

    await request.populate([
      { path: 'pet', select: 'name species breed images' },
      { path: 'adopter', select: 'name email phone' },
      { path: 'reviewedBy', select: 'name email' }
    ]);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete adoption request
// @route   DELETE /api/adoptions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Check if user can delete this request
    if (req.user.role !== 'admin' && request.adopter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }

    // Can only delete pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete request that is not pending' });
    }

    await AdoptionRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Adoption request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
