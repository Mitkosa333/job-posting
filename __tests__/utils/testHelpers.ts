// Test utilities and helpers for the job board application

// Basic test to prevent "no tests found" error
describe('Test Helpers', () => {
  it('should export helper functions', () => {
    expect(typeof createMockJob).toBe('function')
    expect(typeof createMockCandidate).toBe('function')
    expect(typeof MockDatabase).toBe('function')
  })
})

// Simple mock data factories that don't require MongoDB
export const createMockJob = (overrides = {}) => ({
  _id: 'mock-job-id-' + Math.random().toString(36).substr(2, 9),
  title: 'Software Engineer',
  description: 'We are looking for a talented software engineer...',
  candidates: [],
  aiProcessed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

export const createMockCandidate = (overrides = {}) => ({
  _id: 'mock-candidate-id-' + Math.random().toString(36).substr(2, 9),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-0123',
  resume: 'Experienced software developer with 5 years of experience...',
  aiProcessed: false,
  submittedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

export const createMockJobMatch = (overrides = {}) => ({
  jobId: 'mock-job-id-' + Math.random().toString(36).substr(2, 9),
  candidateId: 'mock-candidate-id-' + Math.random().toString(36).substr(2, 9),
  percentage: 75,
  ...overrides
})

// API test helpers
export const createMockRequest = (options: {
  method?: string
  body?: any
  formData?: FormData
  searchParams?: Record<string, string>
  url?: string
} = {}) => {
  const { 
    method = 'GET', 
    body, 
    formData, 
    searchParams = {}, 
    url = 'http://localhost:3000/api/test' 
  } = options

  const requestUrl = new URL(url)
  Object.entries(searchParams).forEach(([key, value]) => {
    requestUrl.searchParams.set(key, value)
  })

  const mockRequest = {
    method,
    url: requestUrl.toString(),
    json: jest.fn().mockResolvedValue(body),
    formData: jest.fn().mockResolvedValue(formData),
    headers: new Headers(),
  } as any

  return mockRequest
}

export const createMockResponse = () => {
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    redirect: jest.fn(),
  }
  return mockResponse
}

// Environment helpers
export const withMockEnv = (envVars: Record<string, string>) => {
  const originalEnv = process.env
  
  beforeEach(() => {
    process.env = { ...originalEnv, ...envVars }
  })
  
  afterEach(() => {
    process.env = originalEnv
  })
}

// OpenAI mock helpers
export const mockOpenAIResponse = (matches: Array<{ jobId?: string, candidateId?: string, percentage: number }>) => {
  const mockCalculateAllJobMatches = jest.fn().mockResolvedValue(
    matches.filter(m => m.jobId).map(m => ({ jobId: m.jobId, percentage: m.percentage }))
  )
  
  const mockCalculateAllCandidateMatches = jest.fn().mockResolvedValue(
    matches.filter(m => m.candidateId).map(m => ({ candidateId: m.candidateId, percentage: m.percentage }))
  )

  return {
    mockCalculateAllJobMatches,
    mockCalculateAllCandidateMatches
  }
}

// Simple database simulation helpers (for tests that don't need real MongoDB)
export class MockDatabase {
  private jobs: any[] = []
  private candidates: any[] = []

  addJob(job: any) {
    this.jobs.push({ ...job, _id: job._id || this.generateId() })
    return this.jobs[this.jobs.length - 1]
  }

  addCandidate(candidate: any) {
    this.candidates.push({ ...candidate, _id: candidate._id || this.generateId() })
    return this.candidates[this.candidates.length - 1]
  }

  findJob(id: string) {
    return this.jobs.find(job => job._id === id)
  }

  findCandidate(id: string) {
    return this.candidates.find(candidate => candidate._id === id)
  }

  getAllJobs() {
    return [...this.jobs]
  }

  getAllCandidates() {
    return [...this.candidates]
  }

  clear() {
    this.jobs = []
    this.candidates = []
  }

  private generateId() {
    return 'mock-id-' + Math.random().toString(36).substr(2, 9)
  }
}

// Test assertion helpers
export const expectValidJobObject = (job: any) => {
  expect(job).toHaveProperty('_id')
  expect(job).toHaveProperty('title')
  expect(job).toHaveProperty('description')
  expect(job).toHaveProperty('candidates')
  expect(job).toHaveProperty('aiProcessed')
  expect(job).toHaveProperty('createdAt')
  expect(job).toHaveProperty('updatedAt')
}

export const expectValidCandidateObject = (candidate: any) => {
  expect(candidate).toHaveProperty('_id')
  expect(candidate).toHaveProperty('firstName')
  expect(candidate).toHaveProperty('lastName')
  expect(candidate).toHaveProperty('email')
  expect(candidate).toHaveProperty('resume')
  expect(candidate).toHaveProperty('aiProcessed')
  expect(candidate).toHaveProperty('submittedAt')
  expect(candidate).toHaveProperty('createdAt')
  expect(candidate).toHaveProperty('updatedAt')
}

// Async test helpers
export const waitFor = async (condition: () => boolean, timeout = 5000) => {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true
    }
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  
  throw new Error(`Condition not met within ${timeout}ms`)
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
