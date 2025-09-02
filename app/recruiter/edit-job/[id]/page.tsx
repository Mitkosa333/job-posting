'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Job {
  _id: string
  title: string
  description: string
  aiProcessed: boolean
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiProcessing, setAiProcessing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch job')
        
        const jobData = await response.json()
        setJob(jobData)
        setFormData({
          title: jobData.title,
          description: jobData.description
        })
      } catch (error) {
        console.error('Error fetching job:', error)
        alert('Failed to load job')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAiProcessing(true)

    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update job')
      }

      // Poll for processing completion
      const pollProcessing = async () => {
        try {
          const statusResponse = await fetch(`/api/jobs/${params.id}/processing-status`)
          if (statusResponse.ok) {
            const statusData = await statusResponse.json()
            
            if (statusData.completed) {
              setAiProcessing(false)
              router.push('/recruiter?updated=true')
            } else {
              setTimeout(pollProcessing, 2000)
            }
          } else {
            // If status endpoint doesn't exist, just redirect after a short delay
            setTimeout(() => {
              setAiProcessing(false)
              router.push('/recruiter?updated=true')
            }, 3000)
          }
        } catch (error) {
          console.error('Error checking processing status:', error)
          setAiProcessing(false)
          router.push('/recruiter?updated=true&aiError=true')
        }
      }

      pollProcessing()
    } catch (error) {
      console.error('Error updating job:', error)
      alert('Failed to update job')
      setIsSubmitting(false)
      setAiProcessing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Job not found</h1>
          <Link href="/recruiter" className="text-blue-600 hover:text-blue-800">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Edit Job Posting</h1>
              <Link
                href="/recruiter"
                className="text-gray-600 hover:text-gray-800"
              >
                Back to Dashboard
              </Link>
            </div>

            {aiProcessing && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">
                      Updating Job Posting
                    </h3>
                    <p className="text-sm text-blue-700">
                      Processing your job updates...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Marketing Manager"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={12}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>

              <div className="flex items-center justify-between pt-6">
                <Link
                  href="/recruiter"
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
