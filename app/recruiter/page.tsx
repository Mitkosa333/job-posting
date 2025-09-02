"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Job {
  _id: string
  title: string
  description: string
  createdAt: string
  candidates?: Array<{
    candidateId: any // MongoDB ObjectId that can be converted to string
    percentage?: number
  }>
}

interface Candidate {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  resume: string
}

function RecruiterDashboardContent() {
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const updated = searchParams.get('updated')
  const aiError = searchParams.get('aiError')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/jobs')
        const jobsData = await response.json()
        
        const candidatesResponse = await fetch('/api/candidates')
        const candidatesData = await candidatesResponse.json()
        
        setJobs(jobsData.map((job: any) => ({
          _id: job._id,
          title: job.title,
          description: job.description,
          createdAt: job.createdAt,
          candidates: job.candidates || []
        })))
        
        setCandidates(candidatesData.map((candidate: any) => ({
          _id: candidate._id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone,
          resume: candidate.resume
        })))
        
        console.log('Fetched candidates:', candidatesData.length)
        console.log('Sample candidate:', candidatesData[0])
        console.log('Sample job candidates:', jobsData[0]?.candidates)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (updated) {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [updated])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getQualifiedCandidates = (job: Job) => {
    if (!job.candidates || job.candidates.length === 0) {
      console.log('No candidates for job:', job.title)
      return []
    }
    
    console.log(`Processing ${job.candidates.length} candidates for job: ${job.title}`)
    
    // Filter candidates with percentage > 50 and sort by percentage (highest first)
    const qualifiedCandidates = job.candidates
      .filter(candidate => {
        const percentage = candidate.percentage || 0
        console.log(`Candidate ${candidate.candidateId} has ${percentage}% match`)
        return percentage > 50
      })
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
    
    console.log(`Found ${qualifiedCandidates.length} qualified candidates (>50%)`)
    
    // Handle both populated and non-populated candidate data
    return qualifiedCandidates.map(jobCandidate => {
      let candidateData
      
      // Check if candidateId is populated (object) or just an ID (string)
      if (typeof jobCandidate.candidateId === 'object' && jobCandidate.candidateId._id) {
        // Populated candidate data
        candidateData = {
          _id: jobCandidate.candidateId._id.toString(),
          firstName: jobCandidate.candidateId.firstName,
          lastName: jobCandidate.candidateId.lastName,
          email: jobCandidate.candidateId.email,
          phone: jobCandidate.candidateId.phone,
          resume: jobCandidate.candidateId.resume
        }
      } else {
        // Non-populated - find candidate from the candidates array
        const candidateIdString = jobCandidate.candidateId.toString()
        const candidate = candidates.find(c => c._id === candidateIdString)
        if (!candidate) {
          console.log('Candidate not found for ID:', candidateIdString)
          return null
        }
        candidateData = candidate
      }
      
      console.log('Found candidate:', candidateData.firstName, candidateData.lastName, 'with', jobCandidate.percentage, '% match')
      
      return {
        ...candidateData,
        percentage: jobCandidate.percentage
      }
    }).filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)
  }

  const toggleExpanded = (jobId: string) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const handleDeleteJob = async (jobId: string) => {
    setDeletingJobId(jobId)
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete job')
      }

      // Remove the job from the local state
      setJobs(prev => prev.filter(job => job._id !== jobId))
      setShowDeleteConfirm(null)
      
      console.log('Job deleted successfully')
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job. Please try again.')
    } finally {
      setDeletingJobId(null)
    }
  }

  const confirmDelete = (jobId: string) => {
    setShowDeleteConfirm(jobId)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Job Posting</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this job posting? This action cannot be undone and all candidate matches will be lost.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => showDeleteConfirm && handleDeleteJob(showDeleteConfirm)}
                    disabled={deletingJobId === showDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {deletingJobId === showDeleteConfirm ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6">
          <div className={`rounded-md p-4 ${aiError ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {aiError ? (
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${aiError ? 'text-yellow-800' : 'text-green-800'}`}>
                  {aiError ? 'Job updated successfully, but AI matching encountered an issue. You can try editing the job again to re-run the matching.' : 'Job updated successfully! AI matching has been re-calculated with new candidate scores.'}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => setShowSuccessMessage(false)}
                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${aiError ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' : 'text-green-500 hover:bg-green-100 focus:ring-green-600'}`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Recruiter Dashboard</h1>
        <p className="text-gray-600">Manage your job postings and track applications all in one place.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <a href="/recruiter/post-job" className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <div>
              <h3 className="font-semibold">Post New Job</h3>
              <p className="text-sm text-blue-100">Create a job posting</p>
            </div>
          </div>
        </a>
      </div>

      {/* Job Listings */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">All Job Listings</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job listings...</p>
          </div>
        ) : (
          <div className="space-y-6">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const qualifiedCandidates = getQualifiedCandidates(job)
              const isExpanded = expandedJobs.has(job._id)
              const candidatesToShow = isExpanded ? qualifiedCandidates : qualifiedCandidates.slice(0, 3)
              
              return (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <a
                      href={`/jobs/${job._id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">{job.title}</h3>
                    </a>
                    <div className="flex space-x-2 ml-4">
                      <a
                        href={`/recruiter/edit-job/${job._id}`}
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Edit
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          confirmDelete(job._id)
                        }}
                        className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <a
                    href={`/jobs/${job._id}`}
                    className="block cursor-pointer"
                  >
                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Posted on {formatDate(job.createdAt)}</span>
                    </div>
                  </a>
                  
                  {/* Qualified Candidates Section */}
                  {qualifiedCandidates.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Top Candidates ({qualifiedCandidates.length})
                      </h4>
                      <div className="space-y-2">
                        {candidatesToShow.map((candidate) => (
                          <a
                            key={candidate._id}
                            href={`/candidates/${candidate._id}`}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.location.href = `/candidates/${candidate._id}`
                            }}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {candidate.firstName} {candidate.lastName}
                              </div>
                              <div className="text-sm text-gray-600">{candidate.email}</div>
                            </div>
                            <div className="ml-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {candidate.percentage}% match
                              </span>
                            </div>
                          </a>
                        ))}
                        {qualifiedCandidates.length > 3 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleExpanded(job._id)
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 text-center pt-2 w-full cursor-pointer"
                          >
                            {isExpanded 
                              ? 'Show less' 
                              : `+${qualifiedCandidates.length - 3} more candidates`
                            }
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs posted yet</h3>
              <p className="mt-1 text-gray-500">Get started by posting your first job.</p>
              <div className="mt-6">
                <a
                  href="/recruiter/post-job"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Post Your First Job
                </a>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function RecruiterDashboard() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <RecruiterDashboardContent />
    </Suspense>
  )
}
