import express from 'express';
import { body, validationResult } from 'express-validator';
import Pet from '../models/Pet.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @desc    Get all pets with filtering and pagination
// @route   GET /api/pets
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { status: 'available' };

    if (req.query.species) {
      filter.species = req.query.species;
    }

    if (req.query.size) {
      filter.size = req.query.size;
    }

    if (req.query.age) {
      const [minAge, maxAge] = req.query.age.split('-').map(Number);
      filter.age = { $gte: minAge };
      if (maxAge) filter.age.$lte = maxAge;
    }

    if (req.query.location) {
      filter.$or = [
        { 'location.city': new RegExp(req.query.location, 'i') },
        { 'location.state': new RegExp(req.query.location, 'i') }
      ];
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Get pets with population
    const pets = await Pet.find(filter)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Pet.countDocuments(filter);

    res.json({
      pets,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPets: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's own pets
// @route   GET /api/pets/my-pets
// @access  Private
router.get('/my-pets/all', protect, async (req, res) => {
  try {
    const pets = await Pet.find({ addedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('addedBy', 'name email');

    res.json({
      pets,
      totalPets: pets.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('addedBy', 'name email phone profileImage');

    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private (All authenticated users can post pets)
router.post('/', protect, upload.array('images', 5), [
  body('name').trim().notEmpty().withMessage('Pet name is required'),
  body('species').isIn(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'other']).withMessage('Invalid species'),
  body('breed').trim().notEmpty().withMessage('Breed is required'),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('gender').isIn(['male', 'female']).withMessage('Invalid gender'),
  body('size').isIn(['small', 'medium', 'large', 'extra-large']).withMessage('Invalid size'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('adoptionFee').isNumeric().withMessage('Adoption fee must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const images = req.files.map(file => `/uploads/${file.filename}`);

    const petData = {
      ...req.body,
      images,
      addedBy: req.user._id,
      location: JSON.parse(req.body.location || '{}'),
      healthStatus: JSON.parse(req.body.healthStatus || '{}'),
      goodWith: JSON.parse(req.body.goodWith || '{}')
    };

    const pet = await Pet.create(petData);
    await pet.populate('addedBy', 'name email');

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (Owner or Admin only)
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user is owner or admin
    if (pet.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this pet' });
    }

    // Update images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      req.body.images = newImages;
    }

    // Parse JSON fields if they exist
    if (req.body.location) {
      req.body.location = JSON.parse(req.body.location);
    }
    if (req.body.healthStatus) {
      req.body.healthStatus = JSON.parse(req.body.healthStatus);
    }
    if (req.body.goodWith) {
      req.body.goodWith = JSON.parse(req.body.goodWith);
    }

    Object.assign(pet, req.body);
    const updatedPet = await pet.save();
    await updatedPet.populate('addedBy', 'name email');

    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (Owner or Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user is owner or admin
    if (pet.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this pet' });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
