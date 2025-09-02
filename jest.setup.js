import '@testing-library/jest-dom'

// Node.js polyfills for testing environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-job-board'
process.env.OPENAI_API_KEY = 'test-api-key'

// Global test utilities
global.fetch = jest.fn()

// Mock Next.js Request/Response for API route testing
global.Request = class MockRequest {
  constructor(url, options = {}) {
    this.url = url
    this.method = options.method || 'GET'
    this.headers = new Headers(options.headers || {})
    this._body = options.body
  }
  
  async json() {
    return JSON.parse(this._body || '{}')
  }
}

global.Response = class MockResponse {
  constructor(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.headers = new Headers(options.headers || {})
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})
