"use client"

import { useState, useEffect } from 'react'

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
  cvFileName: string
}

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

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
          cvFileName: candidate.cvFileName
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getQualifiedCandidates = (job: Job) => {
    if (!job.candidates) return []
    
    // Filter candidates with percentage > 50 and sort by percentage (highest first)
    const qualifiedCandidateIds = job.candidates
      .filter(candidate => (candidate.percentage || 0) > 50)
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
    
    // Get full candidate details
    return qualifiedCandidateIds.map(jobCandidate => {
      // Convert candidateId to string for comparison
      const candidateIdString = jobCandidate.candidateId.toString()
      const candidate = candidates.find(c => c._id === candidateIdString)
      if (!candidate) {
        console.log('Candidate not found for ID:', candidateIdString)
        return null
      }
      return {
        ...candidate,
        percentage: jobCandidate.percentage
      }
    }).filter(Boolean)
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <a
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="block bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Posted on {formatDate(job.createdAt)}</span>
                  </div>
                  
                  {/* Qualified Candidates Section */}
                  {qualifiedCandidates.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Top Candidates ({qualifiedCandidates.length})
                      </h4>
                      <div className="space-y-2">
                        {candidatesToShow.map((candidate) => (
                          <div key={candidate._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
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
                          </div>
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
                </a>
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
