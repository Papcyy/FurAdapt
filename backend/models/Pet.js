import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    maxlength: [50, 'Pet name cannot be more than 50 characters']
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'other']
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative']
  },
  ageUnit: {
    type: String,
    enum: ['months', 'years'],
    default: 'years'
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female']
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['small', 'medium', 'large', 'extra-large']
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: [{
    type: String,
    required: true
  }],
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  healthStatus: {
    vaccinated: {
      type: Boolean,
      default: false
    },
    spayedNeutered: {
      type: Boolean,
      default: false
    },
    healthIssues: {
      type: String,
      default: ''
    }
  },
  adoptionFee: {
    type: Number,
    required: [true, 'Adoption fee is required'],
    min: [0, 'Adoption fee cannot be negative']
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adoptedAt: {
    type: Date,
    default: null
  },
  specialNeeds: {
    type: String,
    default: ''
  },
  goodWith: {
    children: {
      type: Boolean,
      default: false
    },
    dogs: {
      type: Boolean,
      default: false
    },
    cats: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for searching
petSchema.index({ name: 'text', breed: 'text', description: 'text' });
petSchema.index({ species: 1, status: 1 });
petSchema.index({ location: 1 });

export default mongoose.model('Pet', petSchema);
