import dbConnect from '@/lib/mongoose'
import Job from '@/models/Job'
import { Types } from 'mongoose'

interface JobDetailPageProps {
  params: { id: string }
}

interface JobData {
  _id: string
  title: string
  description: string
  createdAt: string
  candidates?: Array<{
    candidateId: string
    percentage?: number
  }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  let job: JobData | null = null
  
  try {
    await dbConnect()
    
    if (!Types.ObjectId.isValid(params.id)) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Job ID</h1>
            <p className="text-gray-600 mb-6">The job ID provided is not valid.</p>
            <a
              href="/recruiter"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ← Back to Job Listings
            </a>
          </div>
        </div>
      )
    }
    
    const jobData = await Job.findById(params.id)
    
    if (jobData) {
      job = {
        _id: jobData._id.toString(),
        title: jobData.title,
        description: jobData.description,
        createdAt: jobData.createdAt.toISOString(),
        candidates: jobData.candidates || []
      }
    }
  } catch (error) {
    console.error('Error fetching job:', error)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <a
            href="/recruiter"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Job Listings
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <a
          href="/recruiter"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job Listings
        </a>
      </div>

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <div className="text-sm text-gray-500">
              Posted on {formatDate(job.createdAt)}
            </div>
          </div>

        </div>
      </div>

      {/* Job Content */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {job.description}
          </div>
        </div>
      </div>
    </div>
  )
}
