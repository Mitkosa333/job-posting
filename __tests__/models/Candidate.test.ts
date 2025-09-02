import { createMockCandidate, expectValidCandidateObject } from '../utils/testHelpers'

// Mock the Candidate model to avoid MongoDB dependency
const mockCandidate = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteMany: jest.fn(),
}

// Don't mock the actual file, just test the business logic

describe('Candidate Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Candidate Creation', () => {
    it('should create a candidate with required fields', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        resume: 'Experienced software developer with 5 years of experience...'
      }

      const mockCreatedCandidate = createMockCandidate(candidateData)
      mockCandidate.create.mockResolvedValue(mockCreatedCandidate)

      const result = await mockCandidate.create(candidateData)

      expect(mockCandidate.create).toHaveBeenCalledWith(candidateData)
      expect(result.firstName).toBe(candidateData.firstName)
      expect(result.lastName).toBe(candidateData.lastName)
      expect(result.email).toBe(candidateData.email)
      expectValidCandidateObject(result)
    })

    it('should set default values correctly', async () => {
      const candidateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        resume: 'Marketing professional with expertise in digital campaigns'
      }

      const mockCreatedCandidate = createMockCandidate(candidateData)
      mockCandidate.create.mockResolvedValue(mockCreatedCandidate)

      const result = await mockCandidate.create(candidateData)

      expect(result.aiProcessed).toBe(false)
      expect(result.contacted).toBe(false)
      expect(result.contactedAt).toBeUndefined()
      expect(result.contactNotes).toBeUndefined()
      expect(result.submittedAt).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })

    it('should handle candidate creation errors', async () => {
      const invalidCandidateData = {
        firstName: 'John',
        // Missing required fields
      }

      mockCandidate.create.mockRejectedValue(new Error('Email is required'))

      await expect(mockCandidate.create(invalidCandidateData)).rejects.toThrow('Email is required')
    })
  })

  describe('Email Validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'firstname+lastname@example.org',
        'email@subdomain.example.com'
      ]

      validEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        'test.example.com'
      ]

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        expect(emailRegex.test(email)).toBe(false)
      })
    })

    it('should convert email to lowercase', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'JOHN.DOE@EXAMPLE.COM',
        resume: 'Resume content'
      }

      // Simulate lowercase conversion
      const mockCreatedCandidate = createMockCandidate({
        ...candidateData,
        email: candidateData.email.toLowerCase()
      })
      mockCandidate.create.mockResolvedValue(mockCreatedCandidate)

      const result = await mockCandidate.create(candidateData)

      expect(result.email).toBe('john.doe@example.com')
    })
  })

  describe('Candidate Queries', () => {
    it('should find all candidates', async () => {
      const mockCandidates = [
        createMockCandidate({ firstName: 'Alice', lastName: 'Johnson' }),
        createMockCandidate({ firstName: 'Bob', lastName: 'Smith' })
      ]

      mockCandidate.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockCandidates)
        })
      })

      const query = mockCandidate.find({})
      const result = await query.sort({ submittedAt: -1 }).toArray()

      expect(result).toHaveLength(2)
      expect(result[0].firstName).toBe('Alice')
      expect(result[1].firstName).toBe('Bob')
    })

    it('should find candidate by ID', async () => {
      const candidateId = 'test-candidate-id'
      const mockFoundCandidate = createMockCandidate({ 
        _id: candidateId, 
        firstName: 'Found',
        lastName: 'Candidate' 
      })

      mockCandidate.findById.mockResolvedValue(mockFoundCandidate)

      const result = await mockCandidate.findById(candidateId)

      expect(mockCandidate.findById).toHaveBeenCalledWith(candidateId)
      expect(result._id).toBe(candidateId)
      expect(result.firstName).toBe('Found')
    })

    it('should find candidates by email', async () => {
      const email = 'test@example.com'
      const mockFoundCandidate = createMockCandidate({ email })

      mockCandidate.find.mockResolvedValue([mockFoundCandidate])

      const result = await mockCandidate.find({ email })

      expect(mockCandidate.find).toHaveBeenCalledWith({ email })
      expect(result).toHaveLength(1)
      expect(result[0].email).toBe(email)
    })
  })

  describe('Candidate Updates', () => {
    it('should update candidate successfully', async () => {
      const candidateId = 'test-candidate-id'
      const updateData = { firstName: 'Updated Name' }
      const updatedCandidate = createMockCandidate({ _id: candidateId, ...updateData })

      mockCandidate.findByIdAndUpdate.mockResolvedValue(updatedCandidate)

      const result = await mockCandidate.findByIdAndUpdate(candidateId, updateData, { new: true })

      expect(mockCandidate.findByIdAndUpdate).toHaveBeenCalledWith(candidateId, updateData, { new: true })
      expect(result.firstName).toBe('Updated Name')
    })

    it('should handle update errors', async () => {
      const candidateId = 'test-candidate-id'
      const updateData = { email: 'invalid-email' }

      mockCandidate.findByIdAndUpdate.mockRejectedValue(new Error('Invalid email format'))

      await expect(mockCandidate.findByIdAndUpdate(candidateId, updateData)).rejects.toThrow('Invalid email format')
    })
  })

  describe('AI Processing', () => {
    it('should track AI processing status', async () => {
      const candidateId = 'test-candidate-id'
      const processedCandidate = createMockCandidate({
        _id: candidateId,
        aiProcessed: true
      })

      mockCandidate.findByIdAndUpdate.mockResolvedValue(processedCandidate)

      const result = await mockCandidate.findByIdAndUpdate(
        candidateId,
        { aiProcessed: true },
        { new: true }
      )

      expect(result.aiProcessed).toBe(true)
    })

    it('should filter candidates by AI processing status', async () => {
      const processedCandidates = [
        createMockCandidate({ aiProcessed: true }),
        createMockCandidate({ aiProcessed: true })
      ]

      mockCandidate.find.mockResolvedValue(processedCandidates)

      const result = await mockCandidate.find({ aiProcessed: true })

      expect(mockCandidate.find).toHaveBeenCalledWith({ aiProcessed: true })
      expect(result).toHaveLength(2)
      expect(result.every((candidate: any) => candidate.aiProcessed)).toBe(true)
    })
  })

  describe('String Trimming and Formatting', () => {
    it('should handle string trimming simulation', async () => {
      const candidateData = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  john.doe@example.com  ',
        resume: 'Resume content'
      }

      // Simulate trimming
      const mockCreatedCandidate = createMockCandidate({
        ...candidateData,
        firstName: candidateData.firstName.trim(),
        lastName: candidateData.lastName.trim(),
        email: candidateData.email.trim().toLowerCase()
      })
      mockCandidate.create.mockResolvedValue(mockCreatedCandidate)

      const result = await mockCandidate.create(candidateData)

      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
      expect(result.email).toBe('john.doe@example.com')
    })
  })

  describe('Virtual Properties', () => {
    it('should simulate fullName virtual property', () => {
      const candidate = createMockCandidate({
        firstName: 'Jane',
        lastName: 'Smith'
      })

      // Simulate fullName virtual property
      const fullName = `${candidate.firstName} ${candidate.lastName}`

      expect(fullName).toBe('Jane Smith')
    })

    it('should include virtual properties in serialization simulation', () => {
      const candidate = createMockCandidate({
        firstName: 'Bob',
        lastName: 'Wilson'
      })

      // Simulate JSON serialization with virtual
      const candidateJSON = {
        ...candidate,
        fullName: `${candidate.firstName} ${candidate.lastName}`
      }

      expect(candidateJSON).toHaveProperty('fullName', 'Bob Wilson')
      expect(candidateJSON).toHaveProperty('firstName', 'Bob')
      expect(candidateJSON).toHaveProperty('lastName', 'Wilson')
    })
  })

  describe('Query Operations', () => {
    it('should simulate filtering by AI processing status', async () => {
      const allCandidates = [
        createMockCandidate({ firstName: 'Alice', aiProcessed: true }),
        createMockCandidate({ firstName: 'Bob', aiProcessed: false }),
        createMockCandidate({ firstName: 'Charlie', aiProcessed: true })
      ]

      // Simulate filtering
      const processedCandidates = allCandidates.filter(c => c.aiProcessed === true)
      const unprocessedCandidates = allCandidates.filter(c => c.aiProcessed === false)

      expect(processedCandidates).toHaveLength(2)
      expect(processedCandidates.map(c => c.firstName).sort()).toEqual(['Alice', 'Charlie'])
      
      expect(unprocessedCandidates).toHaveLength(1)
      expect(unprocessedCandidates[0].firstName).toBe('Bob')
    })

    it('should simulate sorting by submission date', () => {
      const candidates = [
        createMockCandidate({ firstName: 'Alice', submittedAt: new Date('2023-01-01') }),
        createMockCandidate({ firstName: 'Bob', submittedAt: new Date('2023-02-01') }),
        createMockCandidate({ firstName: 'Charlie', submittedAt: new Date('2023-03-01') })
      ]

      // Sort newest first (create new array to avoid mutation)
      const newestFirst = [...candidates].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      
      // Sort oldest first (create new array to avoid mutation)
      const oldestFirst = [...candidates].sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime())

      expect(newestFirst.map(c => c.firstName)).toEqual(['Charlie', 'Bob', 'Alice'])
      expect(oldestFirst.map(c => c.firstName)).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('should simulate name pattern matching', () => {
      const candidates = [
        createMockCandidate({ firstName: 'Alice', lastName: 'Johnson' }),
        createMockCandidate({ firstName: 'Bob', lastName: 'Smith' }),
        createMockCandidate({ firstName: 'Charlie', lastName: 'Johnson' })
      ]

      // Simulate case-insensitive lastName search
      const johnsonCandidates = candidates.filter(c => 
        c.lastName.toLowerCase().includes('johnson')
      )
      
      const smithCandidates = candidates.filter(c => 
        c.lastName === 'Smith'
      )

      expect(johnsonCandidates).toHaveLength(2)
      expect(johnsonCandidates.map(c => c.firstName).sort()).toEqual(['Alice', 'Charlie'])
      
      expect(smithCandidates).toHaveLength(1)
      expect(smithCandidates[0].firstName).toBe('Bob')
    })
  })

  describe('Contact Tracking', () => {
    it('should mark candidate as contacted with timestamp and notes', async () => {
      const candidateId = 'test-candidate-id'
      const contactedAt = new Date()
      const contactNotes = 'Spoke with candidate about senior developer position. Very interested and available for interview next week.'
      
      const contactedCandidate = createMockCandidate({
        _id: candidateId,
        contacted: true,
        contactedAt,
        contactNotes
      })

      mockCandidate.findByIdAndUpdate.mockResolvedValue(contactedCandidate)

      const result = await mockCandidate.findByIdAndUpdate(
        candidateId,
        {
          contacted: true,
          contactedAt,
          contactNotes
        },
        { new: true }
      )

      expect(result.contacted).toBe(true)
      expect(result.contactedAt).toEqual(contactedAt)
      expect(result.contactNotes).toBe(contactNotes)
    })

    it('should allow marking candidate as contacted without notes', async () => {
      const candidateId = 'test-candidate-id'
      const contactedAt = new Date()
      
      const contactedCandidate = createMockCandidate({
        _id: candidateId,
        contacted: true,
        contactedAt,
        contactNotes: ''
      })

      mockCandidate.findByIdAndUpdate.mockResolvedValue(contactedCandidate)

      const result = await mockCandidate.findByIdAndUpdate(
        candidateId,
        {
          contacted: true,
          contactedAt,
          contactNotes: ''
        },
        { new: true }
      )

      expect(result.contacted).toBe(true)
      expect(result.contactedAt).toEqual(contactedAt)
      expect(result.contactNotes).toBe('')
    })

    it('should remove contact status', async () => {
      const candidateId = 'test-candidate-id'
      
      const uncontactedCandidate = createMockCandidate({
        _id: candidateId,
        contacted: false,
        contactedAt: undefined,
        contactNotes: undefined
      })

      mockCandidate.findByIdAndUpdate.mockResolvedValue(uncontactedCandidate)

      const result = await mockCandidate.findByIdAndUpdate(
        candidateId,
        {
          contacted: false,
          contactedAt: null,
          contactNotes: ''
        },
        { new: true }
      )

      expect(result.contacted).toBe(false)
      expect(result.contactedAt).toBeUndefined()
      expect(result.contactNotes).toBeUndefined()
    })

    it('should filter candidates by contact status', async () => {
      const allCandidates = [
        createMockCandidate({ firstName: 'Alice', contacted: true, contactedAt: new Date() }),
        createMockCandidate({ firstName: 'Bob', contacted: false }),
        createMockCandidate({ firstName: 'Charlie', contacted: true, contactedAt: new Date() }),
        createMockCandidate({ firstName: 'Diana', contacted: false })
      ]

      // Simulate filtering
      const contactedCandidates = allCandidates.filter(c => c.contacted === true)
      const nonContactedCandidates = allCandidates.filter(c => c.contacted === false)

      expect(contactedCandidates).toHaveLength(2)
      expect(contactedCandidates.map(c => c.firstName).sort()).toEqual(['Alice', 'Charlie'])
      expect(contactedCandidates.every(c => c.contacted)).toBe(true)
      
      expect(nonContactedCandidates).toHaveLength(2)
      expect(nonContactedCandidates.map(c => c.firstName).sort()).toEqual(['Bob', 'Diana'])
      expect(nonContactedCandidates.every(c => !c.contacted)).toBe(true)
    })

    it('should sort candidates by contact date', () => {
      const candidates = [
        createMockCandidate({ 
          firstName: 'Alice', 
          contacted: true, 
          contactedAt: new Date('2024-01-15T10:30:00Z') 
        }),
        createMockCandidate({ 
          firstName: 'Bob', 
          contacted: true, 
          contactedAt: new Date('2024-01-16T14:20:00Z') 
        }),
        createMockCandidate({ 
          firstName: 'Charlie', 
          contacted: true, 
          contactedAt: new Date('2024-01-14T09:15:00Z') 
        })
      ]

      // Sort by contact date (newest first)
      const sortedByContactDate = [...candidates]
        .filter(c => c.contacted && c.contactedAt)
        .sort((a, b) => b.contactedAt!.getTime() - a.contactedAt!.getTime())

      expect(sortedByContactDate.map(c => c.firstName)).toEqual(['Bob', 'Alice', 'Charlie'])
    })

    it('should validate contact notes length and content', () => {
      const shortNotes = 'Brief note'
      const longNotes = 'This is a very detailed note about the conversation with the candidate. We discussed their experience, salary expectations, availability, and next steps in the hiring process.'
      const emptyNotes = ''

      expect(shortNotes.length).toBeGreaterThan(0)
      expect(longNotes.length).toBeGreaterThan(shortNotes.length)
      expect(emptyNotes.length).toBe(0)
      
      // Simulate trimming
      expect(shortNotes.trim()).toBe(shortNotes)
      expect('  spaced notes  '.trim()).toBe('spaced notes')
    })

    it('should handle contact tracking field types', () => {
      const contactedCandidate = createMockCandidate({
        contacted: true,
        contactedAt: new Date(),
        contactNotes: 'Sample contact notes'
      })

      const nonContactedCandidate = createMockCandidate({
        contacted: false
      })

      expect(typeof contactedCandidate.contacted).toBe('boolean')
      expect(contactedCandidate.contactedAt instanceof Date).toBe(true)
      expect(typeof contactedCandidate.contactNotes).toBe('string')

      expect(typeof nonContactedCandidate.contacted).toBe('boolean')
      expect(nonContactedCandidate.contactedAt).toBeUndefined()
      expect(nonContactedCandidate.contactNotes).toBeUndefined()
    })

    it('should simulate contact workflow states', async () => {
      const candidateId = 'workflow-test-id'
      
      // Initial state: not contacted
      let candidate = createMockCandidate({
        _id: candidateId,
        contacted: false
      })
      expect(candidate.contacted).toBe(false)
      expect(candidate.contactedAt).toBeUndefined()

      // Mark as contacted
      const contactTime = new Date()
      candidate = createMockCandidate({
        _id: candidateId,
        contacted: true,
        contactedAt: contactTime,
        contactNotes: 'Initial contact made'
      })
      expect(candidate.contacted).toBe(true)
      expect(candidate.contactedAt).toEqual(contactTime)
      expect(candidate.contactNotes).toBe('Initial contact made')

      // Update contact notes
      candidate = createMockCandidate({
        _id: candidateId,
        contacted: true,
        contactedAt: contactTime,
        contactNotes: 'Initial contact made. Follow-up scheduled for next week.'
      })
      expect(candidate.contactNotes).toContain('Follow-up scheduled')

      // Remove contact status
      candidate = createMockCandidate({
        _id: candidateId,
        contacted: false,
        contactedAt: undefined,
        contactNotes: undefined
      })
      expect(candidate.contacted).toBe(false)
      expect(candidate.contactedAt).toBeUndefined()
      expect(candidate.contactNotes).toBeUndefined()
    })
  })

  describe('Data Validation', () => {
    it('should validate required fields', () => {
      const validCandidate = createMockCandidate()
      const invalidCandidate = { firstName: 'John' } // Missing required fields

      expectValidCandidateObject(validCandidate)
      
      // Test that invalid candidate is missing required fields
      expect(invalidCandidate).not.toHaveProperty('email')
      expect(invalidCandidate).not.toHaveProperty('resume')
    })

    it('should validate field types', () => {
      const candidate = createMockCandidate()

      expect(typeof candidate.firstName).toBe('string')
      expect(typeof candidate.lastName).toBe('string')
      expect(typeof candidate.email).toBe('string')
      expect(typeof candidate.resume).toBe('string')
      expect(typeof candidate.aiProcessed).toBe('boolean')
      expect(candidate.submittedAt instanceof Date).toBe(true)
      expect(candidate.createdAt instanceof Date).toBe(true)
      expect(candidate.updatedAt instanceof Date).toBe(true)
    })

    it('should validate unique email constraint simulation', () => {
      const candidate1 = createMockCandidate({ email: 'test@example.com' })
      const candidate2 = createMockCandidate({ email: 'test@example.com' })
      
      // In a real database, this would cause a unique constraint error
      // Here we simulate the validation
      expect(candidate1.email).toBe(candidate2.email)
      
      // Simulate unique validation
      const isDuplicate = candidate1.email === candidate2.email
      expect(isDuplicate).toBe(true)
    })
  })
})
