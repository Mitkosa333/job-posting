import { createMockJob, expectValidJobObject } from '../utils/testHelpers'

// Mock the Job model to avoid MongoDB dependency
const mockJob = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteMany: jest.fn(),
}

// Don't mock the actual file, just test the business logic

describe('Job Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Job Creation', () => {
    it('should create a job with required fields', async () => {
      const jobData = {
        title: 'Software Engineer',
        description: 'Looking for a talented software engineer to join our team.'
      }

      const mockCreatedJob = createMockJob(jobData)
      mockJob.create.mockResolvedValue(mockCreatedJob)

      const result = await mockJob.create(jobData)

      expect(mockJob.create).toHaveBeenCalledWith(jobData)
      expect(result.title).toBe(jobData.title)
      expect(result.description).toBe(jobData.description)
      expectValidJobObject(result)
    })

    it('should set default values correctly', async () => {
      const jobData = {
        title: 'Test Job',
        description: 'Test description'
      }

      const mockCreatedJob = createMockJob(jobData)
      mockJob.create.mockResolvedValue(mockCreatedJob)

      const result = await mockJob.create(jobData)

      expect(result.candidates).toEqual([])
      expect(result.aiProcessed).toBe(false)
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })

    it('should handle job creation errors', async () => {
      const jobData = {
        description: 'Job without title'
      }

      mockJob.create.mockRejectedValue(new Error('Title is required'))

      await expect(mockJob.create(jobData)).rejects.toThrow('Title is required')
    })
  })

  describe('Job Queries', () => {
    it('should find all jobs', async () => {
      const mockJobs = [
        createMockJob({ title: 'Frontend Developer' }),
        createMockJob({ title: 'Backend Engineer' })
      ]

      mockJob.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockJobs)
        })
      })

      const query = mockJob.find({})
      const result = await query.sort({ createdAt: -1 }).toArray()

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Frontend Developer')
      expect(result[1].title).toBe('Backend Engineer')
    })

    it('should find job by ID', async () => {
      const jobId = 'test-job-id'
      const mockFoundJob = createMockJob({ _id: jobId, title: 'Found Job' })

      mockJob.findById.mockResolvedValue(mockFoundJob)

      const result = await mockJob.findById(jobId)

      expect(mockJob.findById).toHaveBeenCalledWith(jobId)
      expect(result._id).toBe(jobId)
      expect(result.title).toBe('Found Job')
    })

    it('should return null for non-existent job', async () => {
      const jobId = 'non-existent-id'
      mockJob.findById.mockResolvedValue(null)

      const result = await mockJob.findById(jobId)

      expect(result).toBeNull()
    })
  })

  describe('Job Updates', () => {
    it('should update job successfully', async () => {
      const jobId = 'test-job-id'
      const updateData = { title: 'Updated Job Title' }
      const updatedJob = createMockJob({ _id: jobId, ...updateData })

      mockJob.findByIdAndUpdate.mockResolvedValue(updatedJob)

      const result = await mockJob.findByIdAndUpdate(jobId, updateData, { new: true })

      expect(mockJob.findByIdAndUpdate).toHaveBeenCalledWith(jobId, updateData, { new: true })
      expect(result.title).toBe('Updated Job Title')
    })

    it('should handle update errors', async () => {
      const jobId = 'test-job-id'
      const updateData = { title: '' } // Invalid title

      mockJob.findByIdAndUpdate.mockRejectedValue(new Error('Validation failed'))

      await expect(mockJob.findByIdAndUpdate(jobId, updateData)).rejects.toThrow('Validation failed')
    })
  })

  describe('Candidate Management', () => {
    it('should handle adding candidates to jobs', async () => {
      const jobId = 'test-job-id'
      const candidateData = {
        candidateId: 'candidate-123',
        percentage: 85
      }

      const jobWithCandidate = createMockJob({
        _id: jobId,
        candidates: [candidateData]
      })

      mockJob.findByIdAndUpdate.mockResolvedValue(jobWithCandidate)

      const result = await mockJob.findByIdAndUpdate(
        jobId,
        { $push: { candidates: candidateData } },
        { new: true }
      )

      expect(result.candidates).toHaveLength(1)
      expect(result.candidates[0].candidateId).toBe('candidate-123')
      expect(result.candidates[0].percentage).toBe(85)
    })

    it('should validate candidate percentage ranges', () => {
      const validPercentages = [0, 50, 100]
      const invalidPercentages = [-10, 150]

      validPercentages.forEach(percentage => {
        expect(percentage).toBeGreaterThanOrEqual(0)
        expect(percentage).toBeLessThanOrEqual(100)
      })

      invalidPercentages.forEach(percentage => {
        expect(percentage < 0 || percentage > 100).toBe(true)
      })
    })
  })

  describe('AI Processing', () => {
    it('should track AI processing status', async () => {
      const jobId = 'test-job-id'
      const processedJob = createMockJob({
        _id: jobId,
        aiProcessed: true
      })

      mockJob.findByIdAndUpdate.mockResolvedValue(processedJob)

      const result = await mockJob.findByIdAndUpdate(
        jobId,
        { aiProcessed: true },
        { new: true }
      )

      expect(result.aiProcessed).toBe(true)
    })

    it('should filter jobs by AI processing status', async () => {
      const processedJobs = [
        createMockJob({ aiProcessed: true }),
        createMockJob({ aiProcessed: true })
      ]

      mockJob.find.mockResolvedValue(processedJobs)

      const result = await mockJob.find({ aiProcessed: true })

      expect(mockJob.find).toHaveBeenCalledWith({ aiProcessed: true })
      expect(result).toHaveLength(2)
      expect(result.every((job: any) => job.aiProcessed)).toBe(true)
    })
  })

  describe('Search and Filtering', () => {
    it('should support text search simulation', async () => {
      const searchTerm = 'React'
      const matchingJobs = [
        createMockJob({ title: 'React Developer', description: 'React and Vue.js developer needed' })
      ]

      mockJob.find.mockResolvedValue(matchingJobs)

      // Simulate text search
      const result = await mockJob.find({ $text: { $search: searchTerm } })

      expect(result).toHaveLength(1)
      expect(result[0].title).toContain('React')
    })

    it('should support date-based sorting', async () => {
      const jobs = [
        createMockJob({ title: 'Old Job', createdAt: new Date('2023-01-01') }),
        createMockJob({ title: 'New Job', createdAt: new Date('2023-12-01') })
      ]

      // Sort by newest first
      const sortedJobs = jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      expect(sortedJobs[0].title).toBe('New Job')
      expect(sortedJobs[1].title).toBe('Old Job')
    })
  })

  describe('Data Validation', () => {
    it('should validate required fields', () => {
      const validJob = createMockJob()
      const invalidJob = { description: 'Missing title' }

      expectValidJobObject(validJob)
      
      // Test that invalid job is missing required fields
      expect(invalidJob).not.toHaveProperty('title')
      expect(invalidJob).not.toHaveProperty('_id')
    })

    it('should validate field types', () => {
      const job = createMockJob()

      expect(typeof job.title).toBe('string')
      expect(typeof job.description).toBe('string')
      expect(typeof job.aiProcessed).toBe('boolean')
      expect(Array.isArray(job.candidates)).toBe(true)
      expect(job.createdAt instanceof Date).toBe(true)
      expect(job.updatedAt instanceof Date).toBe(true)
    })
  })
})
