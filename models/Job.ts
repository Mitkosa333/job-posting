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
  candidates: [{
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
  }],
}, {
  timestamps: true,
})

// Create indexes for better query performance
JobSchema.index({ title: 'text', description: 'text' })
JobSchema.index({ createdAt: -1 })
JobSchema.index({ 'candidates.candidateId': 1 })
JobSchema.index({ 'candidates.percentage': -1 })

export default mongoose.models.Job || mongoose.model('Job', JobSchema)
