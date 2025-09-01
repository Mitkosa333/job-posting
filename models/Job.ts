import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Create indexes for better query performance
JobSchema.index({ title: 'text', description: 'text' })
JobSchema.index({ createdAt: -1 })

export default mongoose.models.Job || mongoose.model('Job', JobSchema)
