# Testing Documentation

This document describes the testing setup and strategy for the Job Board application.

## Testing Framework

The application uses **Jest** as the primary testing framework with the following key dependencies:

- **Jest**: Test runner and assertion library
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Additional Jest matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation
- **mongodb-memory-server**: In-memory MongoDB for database testing
- **ts-jest**: TypeScript support for Jest

## Test Structure

```
__tests__/
├── api/                    # API route tests
│   ├── applications.test.ts
│   └── jobs.test.ts
├── components/             # React component tests
│   └── ProcessingStatus.test.tsx
├── lib/                    # Library and utility tests
│   └── openai.test.ts
├── models/                 # Database model tests
│   ├── Candidate.test.ts
│   └── Job.test.ts
├── utils/                  # Test utilities and helpers
│   └── testHelpers.ts
├── setup.ts               # Global test setup
└── README.md              # This file
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Advanced Usage

```bash
# Run specific test file
npm test -- JobModel.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should create"

# Run tests with verbose output
npm test -- --verbose

# Run tests and update snapshots
npm test -- --updateSnapshot
```

## Test Categories

### 1. API Route Tests (`__tests__/api/`)

Tests Next.js API routes to ensure proper:
- Request handling
- Response formatting
- Error handling
- Database operations
- AI integration

**Example:**
```typescript
describe('/api/jobs', () => {
  it('should return all jobs', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    // ... assertions
  })
})
```

### 2. Model Tests (`__tests__/models/`)

Tests Mongoose models for:
- Schema validation
- Field requirements
- Default values
- Indexes
- Virtual properties
- Custom methods

**Example:**
```typescript
describe('Job Model', () => {
  it('should require title field', async () => {
    const job = new Job({ description: 'Only description' })
    await expect(job.save()).rejects.toThrow(/title.*required/)
  })
})
```

### 3. OpenAI Integration Tests (`__tests__/lib/`)

Tests AI functionality including:
- API communication
- Response parsing
- Error handling
- Rate limiting
- Configuration validation

**Example:**
```typescript
describe('analyzeResumeMatch', () => {
  it('should return percentage match', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '85' } }]
    })
    
    const percentage = await analyzeResumeMatch(resume, jobDescription)
    expect(percentage).toBe(85)
  })
})
```

### 4. Component Tests (`__tests__/components/`)

Tests React components for:
- Rendering behavior
- User interactions
- State changes
- Props handling
- Accessibility

**Example:**
```typescript
describe('ProcessingStatus', () => {
  it('should show processing indicator', () => {
    render(<ProcessingStatus candidateId="test-id" />)
    expect(screen.getByText('AI Analysis in Progress')).toBeInTheDocument()
  })
})
```

## Test Utilities

### Database Testing (`testHelpers.ts`)

Helper functions for database testing:

```typescript
// Setup/teardown
await setupTestDatabase()
await teardownTestDatabase()
await clearTestDatabase()

// Mock data creation
const mockJob = createMockJob({ title: 'Custom Title' })
const mockCandidate = createMockCandidate({ email: 'test@example.com' })

// Assertions
await expectJobInDatabase(db, jobId)
await expectCandidateInDatabase(db, candidateId)
```

### API Testing

Helper functions for API testing:

```typescript
// Create mock requests
const request = createMockRequest({
  method: 'POST',
  body: { title: 'Test Job' },
  formData: formData
})

// Mock OpenAI responses
const { mockCalculateAllJobMatches } = mockOpenAIResponse([
  { jobId: 'job1', percentage: 85 }
])
```

## Mocking Strategy

### External Dependencies

1. **MongoDB**: Uses `mongodb-memory-server` for isolated testing
2. **OpenAI API**: Mocked using Jest mocks
3. **Next.js Router**: Mocked navigation functions
4. **Fetch API**: Global fetch mock for API calls

### Environment Variables

Test environment automatically sets:
```typescript
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-job-board'
process.env.OPENAI_API_KEY = 'test-api-key'
```

## Coverage Goals

The project aims for:
- **80%+ line coverage** overall
- **90%+ coverage** for critical business logic
- **100% coverage** for utility functions

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
it('should create a valid job', async () => {
  // Arrange
  const jobData = { title: 'Test Job', description: 'Test description' }
  
  // Act
  const job = await Job.create(jobData)
  
  // Assert
  expect(job.title).toBe('Test Job')
})
```

### 2. Descriptive Test Names

- ✅ `should return 404 when job not found`
- ❌ `test job endpoint`

### 3. Isolated Tests

Each test should:
- Be independent of other tests
- Clean up after itself
- Not depend on external state

### 4. Mock External Dependencies

- Mock APIs, databases, and third-party services
- Use consistent mock data
- Clean mocks between tests

### 5. Test Edge Cases

- Invalid inputs
- Network errors
- Empty responses
- Rate limits
- Authentication failures

## Continuous Integration

### GitHub Actions

The project includes automated testing via GitHub Actions:

```yaml
- name: Run tests
  run: npm test
  env:
    CI: true

- name: Run tests with coverage
  run: npm run test:coverage
```

### Pre-commit Hooks

Consider adding pre-commit hooks to run tests:

```bash
# Install husky for Git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

## Debugging Tests

### Common Issues

1. **Async/Await**: Ensure proper async handling
2. **Cleanup**: Clear mocks and database between tests
3. **Timers**: Use `jest.useFakeTimers()` for time-dependent tests
4. **MongoDB**: Ensure proper connection/disconnection

### Debug Commands

```bash
# Run tests with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Run single test with debug output
npm test -- --testNamePattern="specific test" --verbose
```

## Future Improvements

1. **Integration Tests**: Add end-to-end testing with Playwright
2. **Performance Tests**: Add load testing for API endpoints
3. **Visual Regression**: Add screenshot testing for UI components
4. **Contract Testing**: Add API contract testing
5. **Mutation Testing**: Add mutation testing for test quality

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Maintain or improve coverage percentage
3. Follow existing test patterns
4. Update this documentation if needed
5. Run full test suite before submitting PR

For questions about testing, please refer to the Jest documentation or open an issue.
