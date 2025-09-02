import mongoose from 'mongoose'

const CandidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: 'Please enter a valid email address'
    }
  },
  phone: {
    type: String,
    trim: true,
  },
  resume: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  aiProcessed: {
    type: Boolean,
    default: false,
  },
  contacted: {
    type: Boolean,
    default: false,
  },
  contactedAt: {
    type: Date,
  },
  contactNotes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
})

// Create indexes for better query performance
CandidateSchema.index({ email: 1 })
CandidateSchema.index({ submittedAt: -1 })
CandidateSchema.index({ firstName: 1, lastName: 1 })
CandidateSchema.index({ createdAt: -1 })
CandidateSchema.index({ aiProcessed: 1 })
CandidateSchema.index({ contacted: 1 })
CandidateSchema.index({ contactedAt: -1 })

// Virtual for full name
CandidateSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Ensure virtual fields are serialized
CandidateSchema.set('toJSON', { virtuals: true })
CandidateSchema.set('toObject', { virtuals: true })

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema)
