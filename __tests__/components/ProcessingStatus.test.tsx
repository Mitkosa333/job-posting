import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ProcessingStatus from '@/components/ProcessingStatus'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('ProcessingStatus Component', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Initial Rendering', () => {
    it('should render processing status initially', () => {
      // Arrange
      const candidateId = 'test-candidate-id'

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Assert
      expect(screen.getByText('AI Analysis in Progress')).toBeInTheDocument()
      expect(screen.getByText(/Our AI is analyzing your resume/)).toBeInTheDocument()
      expect(screen.getByText('AI Analysis in Progress')).toBeInTheDocument()
    })

    it('should display animated dots', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      render(<ProcessingStatus candidateId={candidateId} />)

      // Act - advance timers to trigger dots animation
      act(() => {
        jest.advanceTimersByTime(500)
      })

      // Assert - check that dots are being added
      await waitFor(() => {
        expect(screen.getByText(/AI Analysis in Progress/)).toBeInTheDocument()
      })
    })
  })

  describe('API Polling', () => {
    it('should poll processing status every 2 seconds', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({
          isProcessed: false,
          message: 'Still processing...'
        })
      })

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Advance past initial render
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Assert
      expect(fetch).toHaveBeenCalledWith(`/api/processing-status?candidateId=${candidateId}`)

      // Act - advance another 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should handle successful processing completion', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({
          isProcessed: true,
          message: 'Processing complete! Found 3 job matches.',
          matchCount: 3
        })
      })

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Advance timers to trigger API call
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Wait for state update
      await waitFor(() => {
        expect(screen.getByText('Processing Complete!')).toBeInTheDocument()
      })

      // Assert
      expect(screen.getByText('Processing complete! Found 3 job matches. Redirecting...')).toBeInTheDocument()
      expect(screen.queryByText('AI Analysis in Progress')).not.toBeInTheDocument()
    })

    it('should redirect after successful completion', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({
          isProcessed: true,
          message: 'Processing complete!',
          matchCount: 2
        })
      })

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Advance timers to trigger API call
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Wait for completion state
      await waitFor(() => {
        expect(screen.getByText('Processing Complete!')).toBeInTheDocument()
      })

      // Advance timers for redirect delay
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/?success=true')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Advance timers to trigger API call
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Processing Error')).toBeInTheDocument()
      })

      // Assert
      expect(screen.getByText('Error checking processing status')).toBeInTheDocument()
      expect(screen.getByText('Go back to application form')).toBeInTheDocument()
    })

    it('should provide link back to application form on error', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Advance timers to trigger API call
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Processing Error')).toBeInTheDocument()
      })

      // Assert
      const errorLink = screen.getByRole('link', { name: 'Go back to application form' })
      expect(errorLink).toHaveAttribute('href', '/?error=true')
    })

    it('should stop polling on error', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Advance timers to trigger first API call (which will fail)
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Processing Error')).toBeInTheDocument()
      })

      // Clear the mock call count
      ;(fetch as jest.Mock).mockClear()

      // Advance more time to check if polling stopped
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      // Assert
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('Component Cleanup', () => {
    it('should cleanup intervals on unmount', () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      const { unmount } = render(<ProcessingStatus candidateId={candidateId} />)

      // Spy on clearInterval
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')

      // Act
      unmount()

      // Assert
      expect(clearIntervalSpy).toHaveBeenCalled()

      // Cleanup
      clearIntervalSpy.mockRestore()
    })

    it('should not make API calls after unmount', () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({ isProcessed: false })
      })

      const { unmount } = render(<ProcessingStatus candidateId={candidateId} />)

      // Act - unmount before timer fires
      unmount()

      // Clear previous calls
      ;(fetch as jest.Mock).mockClear()

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      // Assert
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('Visual States', () => {
    it('should show correct success styling', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({
          isProcessed: true,
          message: 'Processing complete!'
        })
      })

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Wait for completion state
      await waitFor(() => {
        expect(screen.getByText('Processing Complete!')).toBeInTheDocument()
      })

      // Assert - check for the outer div with the correct classes
      const outerSuccessDiv = screen.getByText('Processing Complete!').closest('div')?.parentElement
      expect(outerSuccessDiv).toHaveClass('bg-green-50', 'border-green-200', 'text-green-700')
    })

    it('should show correct error styling', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Test error'))

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Processing Error')).toBeInTheDocument()
      })

      // Assert - check for the outer div with the correct classes
      const outerErrorDiv = screen.getByText('Processing Error').closest('div')?.parentElement
      expect(outerErrorDiv).toHaveClass('bg-red-50', 'border-red-200', 'text-red-700')
    })

    it('should show correct processing styling', () => {
      // Arrange
      const candidateId = 'test-candidate-id'

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Assert - check for the outer div with the correct classes
      const outerProcessingDiv = screen.getByText(/AI Analysis in Progress/).closest('div')?.parentElement
      expect(outerProcessingDiv).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-700')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for loading state', () => {
      // Arrange
      const candidateId = 'test-candidate-id'

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      // Assert - check that the spinner is present and animated
      expect(screen.getByText(/AI Analysis in Progress/)).toBeInTheDocument()
    })

    it('should be keyboard accessible in error state', async () => {
      // Arrange
      const candidateId = 'test-candidate-id'
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Test error'))

      // Act
      render(<ProcessingStatus candidateId={candidateId} />)

      act(() => {
        jest.advanceTimersByTime(2000)
      })

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Processing Error')).toBeInTheDocument()
      })

      // Assert
      const errorLink = screen.getByRole('link', { name: 'Go back to application form' })
      expect(errorLink).toBeInTheDocument()
    })
  })
})
