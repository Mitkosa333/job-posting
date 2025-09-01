import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface JobDetailPageProps {
  params: { id: string }
}

interface Job {
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
  let job: Job | null = null
  
  try {
    const client = await clientPromise
    const db = client.db('job-board')
    const jobData = await db.collection('jobs').findOne({ _id: new ObjectId(params.id) })
    
    if (jobData) {
      job = {
        _id: jobData._id.toString(),
        title: jobData.title,
        description: jobData.description,
        createdAt: jobData.createdAt,
        candidates: jobData.candidates || []
      }
    }
  } catch (error) {
    console.error('Error fetching job:', error)
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 14) return '1 week ago'
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
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
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <span className="text-sm">
                {job.candidates?.length || 0} applications
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Posted {formatRelativeTime(job.createdAt)}
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
