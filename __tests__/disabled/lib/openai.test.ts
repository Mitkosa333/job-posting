import { 
  analyzeResumeMatch, 
  calculateAllJobMatches, 
  calculateAllCandidateMatches 
} from '@/lib/openai'

// Mock the entire OpenAI module
const mockCreate = jest.fn()

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate
        }
      }
    }))
  }
})

// Mock the OpenAI module before importing it
jest.mock('@/lib/openai', () => {
  const originalModule = jest.requireActual('@/lib/openai')
  return {
    ...originalModule,
    __esModule: true,
  }
})

describe('OpenAI Integration', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    mockCreate.mockClear()
    
    // Mock environment variables
    process.env.OPENAI_API_KEY = 'test-api-key'
  })

  describe('analyzeResumeMatch', () => {
    it('should return percentage match for valid inputs', async () => {
      // Arrange
      const resume = 'Senior React developer with 5 years of experience in modern web development'
      const jobDescription = 'Looking for a React developer with experience in modern frontend technologies'
      
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: '85'
          }
        }]
      })

      // Act
      const percentage = await analyzeResumeMatch(resume, jobDescription)

      // Assert
      expect(percentage).toBe(85)
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('professional recruiter')
          }),
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining(resume)
          })
        ]),
        max_tokens: 10,
        temperature: 0.3
      })
    })

    it('should handle non-numeric OpenAI responses', async () => {
      // Arrange
      const resume = 'Test resume'
      const jobDescription = 'Test job description'
      
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: 'Not a number'
          }
        }]
      })

      // Act & Assert
      await expect(analyzeResumeMatch(resume, jobDescription)).rejects.toThrow('Invalid percentage returned from OpenAI')
    })

    it('should handle percentage out of range (above 100)', async () => {
      // Arrange
      const resume = 'Test resume'
      const jobDescription = 'Test job description'
      
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: '150'
          }
        }]
      })

      // Act & Assert
      await expect(analyzeResumeMatch(resume, jobDescription)).rejects.toThrow('Percentage must be between 0 and 100')
    })

    it('should handle percentage out of range (below 0)', async () => {
      // Arrange
      const resume = 'Test resume'
      const jobDescription = 'Test job description'
      
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: '-10'
          }
        }]
      })

      // Act & Assert
      await expect(analyzeResumeMatch(resume, jobDescription)).rejects.toThrow('Percentage must be between 0 and 100')
    })

    it('should handle OpenAI API errors', async () => {
      // Arrange
      const resume = 'Test resume'
      const jobDescription = 'Test job description'
      
      mockCreate.mockRejectedValue(new Error('OpenAI API Error'))

      // Act & Assert
      await expect(analyzeResumeMatch(resume, jobDescription)).rejects.toThrow('OpenAI API Error')
    })

    it('should throw error when OpenAI API key is missing', async () => {
      // Arrange
      delete process.env.OPENAI_API_KEY
      const resume = 'Test resume'
      const jobDescription = 'Test job description'

      // Act & Assert
      await expect(analyzeResumeMatch(resume, jobDescription)).rejects.toThrow('OpenAI not configured - API key required for resume analysis')
    })

    it('should handle empty OpenAI response', async () => {
      // Arrange
      const resume = 'Test resume'
      const jobDescription = 'Test job description'
      
      mockCreate.mockResolvedValue({
        choices: []
      })

      // Act & Assert
      await expect(analyzeResumeMatch(resume, jobDescription)).rejects.toThrow('No response from OpenAI')
    })
  })

  describe('calculateAllJobMatches', () => {
    it('should calculate matches for multiple jobs', async () => {
      // Arrange
      const resume = 'React developer with Node.js experience'
      const jobs = [
        { _id: 'job1', description: 'React developer needed' },
        { _id: 'job2', description: 'Node.js backend engineer' },
        { _id: 'job3', description: 'Python data scientist' }
      ]

      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: '90' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: '75' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: '20' } }] })

      // Act
      const matches = await calculateAllJobMatches(resume, jobs)

      // Assert
      expect(matches).toHaveLength(3)
      expect(matches[0]).toEqual({ jobId: 'job1', percentage: 90 })
      expect(matches[1]).toEqual({ jobId: 'job2', percentage: 75 })
      expect(matches[2]).toEqual({ jobId: 'job3', percentage: 20 })
      expect(mockCreate).toHaveBeenCalledTimes(3)
    })

    it('should handle empty jobs array', async () => {
      // Arrange
      const resume = 'Test resume'
      const jobs: any[] = []

      // Act
      const matches = await calculateAllJobMatches(resume, jobs)

      // Assert
      expect(matches).toEqual([])
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it('should skip jobs with individual API failures', async () => {
      // Arrange
      const resume = 'Test resume'
      const jobs = [
        { _id: 'job1', description: 'Job 1 description' },
        { _id: 'job2', description: 'Job 2 description' },
        { _id: 'job3', description: 'Job 3 description' }
      ]

      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: '80' } }] })
        .mockRejectedValueOnce(new Error('API Error for job 2'))
        .mockResolvedValueOnce({ choices: [{ message: { content: '65' } }] })

      // Act
      const matches = await calculateAllJobMatches(resume, jobs)

      // Assert
      expect(matches).toHaveLength(2) // Should skip failed job
      expect(matches[0]).toEqual({ jobId: 'job1', percentage: 80 })
      expect(matches[1]).toEqual({ jobId: 'job3', percentage: 65 })
    })

    it('should include rate limiting delay', async () => {
      // Arrange
      const resume = 'Test resume'
      const jobs = [
        { _id: 'job1', description: 'Job 1' },
        { _id: 'job2', description: 'Job 2' }
      ]

      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: '80' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: '70' } }] })

      const startTime = Date.now()

      // Act
      await calculateAllJobMatches(resume, jobs)

      // Assert
      const endTime = Date.now()
      const duration = endTime - startTime
      expect(duration).toBeGreaterThanOrEqual(100) // Should have at least 100ms delay
    })
  })

  describe('calculateAllCandidateMatches', () => {
    it('should calculate matches for multiple candidates', async () => {
      // Arrange
      const jobDescription = 'Looking for React developers'
      const candidates = [
        { _id: 'candidate1', resume: 'React expert with 5 years experience' },
        { _id: 'candidate2', resume: 'Vue.js developer looking to learn React' },
        { _id: 'candidate3', resume: 'Backend Python developer' }
      ]

      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: '95' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: '60' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: '15' } }] })

      // Act
      const matches = await calculateAllCandidateMatches(jobDescription, candidates)

      // Assert
      expect(matches).toHaveLength(3)
      expect(matches[0]).toEqual({ candidateId: 'candidate1', percentage: 95 })
      expect(matches[1]).toEqual({ candidateId: 'candidate2', percentage: 60 })
      expect(matches[2]).toEqual({ candidateId: 'candidate3', percentage: 15 })
    })

    it('should handle empty candidates array', async () => {
      // Arrange
      const jobDescription = 'Test job description'
      const candidates: any[] = []

      // Act
      const matches = await calculateAllCandidateMatches(jobDescription, candidates)

      // Assert
      expect(matches).toEqual([])
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it('should skip candidates with individual API failures', async () => {
      // Arrange
      const jobDescription = 'Test job description'
      const candidates = [
        { _id: 'candidate1', resume: 'Resume 1' },
        { _id: 'candidate2', resume: 'Resume 2' },
        { _id: 'candidate3', resume: 'Resume 3' }
      ]

      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: '85' } }] })
        .mockRejectedValueOnce(new Error('API Error for candidate 2'))
        .mockResolvedValueOnce({ choices: [{ message: { content: '70' } }] })

      // Act
      const matches = await calculateAllCandidateMatches(jobDescription, candidates)

      // Assert
      expect(matches).toHaveLength(2) // Should skip failed candidate
      expect(matches[0]).toEqual({ candidateId: 'candidate1', percentage: 85 })
      expect(matches[1]).toEqual({ candidateId: 'candidate3', percentage: 70 })
    })
  })

  describe('Environment Configuration', () => {
    it('should use correct OpenAI API key from environment', async () => {
      // Arrange
      process.env.OPENAI_API_KEY = 'custom-test-key'
      const resume = 'Test resume'
      const jobDescription = 'Test job'
      
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: '75' } }]
      })

      // Act
      await analyzeResumeMatch(resume, jobDescription)

      // Assert
      // The OpenAI instance should be created with the API key from environment
      const OpenAI = require('openai').default
      expect(OpenAI).toHaveBeenCalledWith({
        apiKey: 'custom-test-key'
      })
    })

    it('should throw descriptive error when API key is undefined', async () => {
      // Arrange
      process.env.OPENAI_API_KEY = undefined
      const resume = 'Test resume'
      const jobDescription = 'Test job'

      // Act & Assert
      await expect(analyzeResumeMatch(resume, jobDescription)).rejects.toThrow(
        'OpenAI not configured - API key required for resume analysis'
      )
    })

    it('should throw descriptive error when API key is empty string', async () => {
      // Arrange
      process.env.OPENAI_API_KEY = ''
      const resume = 'Test resume'
      const jobDescription = 'Test job'

      // Act & Assert
      await expect(analyzeResumeMatch(resume, jobDescription)).rejects.toThrow(
        'OpenAI not configured - API key required for resume analysis'
      )
    })
  })

  describe('Rate Limiting', () => {
    it('should apply rate limiting between API calls', async () => {
      // This test ensures we don't hit OpenAI rate limits
      const resume = 'Test resume'
      const jobs = Array.from({ length: 3 }, (_, i) => ({
        _id: `job${i + 1}`,
        description: `Job ${i + 1} description`
      }))

      mockCreate.mockResolvedValue({
        choices: [{ message: { content: '75' } }]
      })

      const startTime = Date.now()
      
      // Act
      await calculateAllJobMatches(resume, jobs)
      
      // Assert
      const endTime = Date.now()
      const totalDuration = endTime - startTime
      
      // Should have at least 100ms total delay (100ms between each of the 2 calls)
      expect(totalDuration).toBeGreaterThanOrEqual(100)
    })
  })
})
