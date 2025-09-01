"use client"

import { useState, useEffect } from 'react'

interface CandidateDetailPageProps {
  params: { id: string }
}

interface Candidate {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  resume: string
  submittedAt: string
  createdAt: string
  updatedAt: string
}

export default function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`/api/candidates/${params.id}`)
        if (response.ok) {
          const candidateData = await response.json()
          setCandidate(candidateData)
        } else {
          setError(true)
        }
      } catch (error) {
        console.error('Error fetching candidate:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidate()
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    )
  }

  if (error || !candidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Candidate Not Found</h1>
          <p className="text-gray-600 mb-8">The candidate you are looking for does not exist or has been removed.</p>
          <a href="/recruiter" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <a href="/recruiter" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </a>
      </div>

      {/* Candidate Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <div className="flex items-center gap-6 text-gray-600 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:text-blue-800">
                  {candidate.email}
                </a>
              </div>
              {candidate.phone && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:text-blue-800">
                    {candidate.phone}
                  </a>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Application submitted on {formatDate(candidate.submittedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Details */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Candidate Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <div className="text-gray-900">{candidate.firstName}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <div className="text-gray-900">{candidate.lastName}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="text-gray-900">
              <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:text-blue-800">
                {candidate.email}
              </a>
            </div>
          </div>
          
          {candidate.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="text-gray-900">
                <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:text-blue-800">
                  {candidate.phone}
                </a>
              </div>
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
            <div className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-line">
              {candidate.resume}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Date</label>
            <div className="text-gray-900">{formatDate(candidate.submittedAt)}</div>
          </div>
        </div>
      </div>


    </div>
  )
}
