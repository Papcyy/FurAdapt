import mongoose from 'mongoose';

const adoptionRequestSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  applicationData: {
    livingSpace: {
      type: String,
      enum: ['apartment', 'house', 'farm'],
      required: true
    },
    hasYard: {
      type: Boolean,
      default: false
    },
    hasOtherPets: {
      type: Boolean,
      default: false
    },
    otherPetsDetails: {
      type: String,
      default: ''
    },
    hasChildren: {
      type: Boolean,
      default: false
    },
    childrenAges: {
      type: String,
      default: ''
    },
    experience: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true,
      maxlength: [500, 'Reason cannot be more than 500 characters']
    },
    workSchedule: {
      type: String,
      required: true
    },
    emergencyContact: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      relationship: {
        type: String,
        required: true
      }
    }
  },
  adminNotes: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
adoptionRequestSchema.index({ pet: 1, adopter: 1 }, { unique: true });
adoptionRequestSchema.index({ status: 1 });
adoptionRequestSchema.index({ createdAt: -1 });

export default mongoose.model('AdoptionRequest', adoptionRequestSchema);
