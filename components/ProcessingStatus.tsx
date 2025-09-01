"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProcessingStatusProps {
  candidateId: string
}

export default function ProcessingStatus({ candidateId }: ProcessingStatusProps) {
  const [status, setStatus] = useState<'processing' | 'complete' | 'error'>('processing')
  const [message, setMessage] = useState('Processing your application...')
  const [dots, setDots] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Animated dots effect
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    // Poll for status every 2 seconds
    const statusInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/processing-status?candidateId=${candidateId}`)
        const data = await response.json()

        if (data.isProcessed) {
          setStatus('complete')
          setMessage(data.message)
          clearInterval(statusInterval)
          clearInterval(dotsInterval)
          
          // Redirect to success page after 2 seconds
          setTimeout(() => {
            router.push('/?success=true')
          }, 2000)
        }
      } catch (error) {
        console.error('Error checking status:', error)
        setStatus('error')
        setMessage('Error checking processing status')
        clearInterval(statusInterval)
        clearInterval(dotsInterval)
      }
    }, 2000)

    // Cleanup on unmount
    return () => {
      clearInterval(statusInterval)
      clearInterval(dotsInterval)
    }
  }, [candidateId, router])

  if (status === 'complete') {
    return (
      <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Processing Complete!</span>
        </div>
        <p className="mt-1 text-sm">{message} Redirecting...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="font-medium">Processing Error</span>
        </div>
        <p className="mt-1 text-sm">{message}</p>
        <a href="/?error=true" className="mt-2 inline-block text-sm underline">
          Go back to application form
        </a>
      </div>
    )
  }

  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
      <div className="flex items-center">
        <svg className="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="font-medium">AI Analysis in Progress{dots}</span>
      </div>
      <p className="mt-1 text-sm">Our AI is analyzing your resume against all job openings. This process happens automatically in the background and typically takes 10-30 seconds.</p>
    </div>
  )
}
