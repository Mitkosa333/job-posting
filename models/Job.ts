import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
  },
  salary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Create indexes for better query performance
JobSchema.index({ title: 'text', description: 'text', requirements: 'text' })
JobSchema.index({ location: 1 })
JobSchema.index({ type: 1 })
JobSchema.index({ createdAt: -1 })

export default mongoose.models.Job || mongoose.model('Job', JobSchema)
