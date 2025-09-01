// Simple test to verify Jest setup is working
describe('Basic Jest Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle async operations', async () => {
    const promise = Promise.resolve(42)
    const result = await promise
    expect(result).toBe(42)
  })

  it('should mock functions', () => {
    const mockFn = jest.fn()
    mockFn('test')
    expect(mockFn).toHaveBeenCalledWith('test')
  })
})

describe('Environment Setup', () => {
  it('should have test environment variables', () => {
    expect(process.env.OPENAI_API_KEY).toBe('test-api-key')
    expect(process.env.MONGODB_URI).toContain('test-job-board')
  })

  it('should have TextEncoder available', () => {
    // TextEncoder should be available through the util polyfill
    expect(typeof global.TextEncoder).toBe('function')
    expect(typeof global.TextDecoder).toBe('function')
  })
})
