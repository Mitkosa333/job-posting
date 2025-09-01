import clientPromise from '@/lib/mongodb'

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

export default async function RecruiterDashboard() {
  let jobs: Job[] = []

  try {
    const client = await clientPromise
    const db = client.db('job-board')
    const jobsData = await db.collection('jobs').find({}).sort({ createdAt: -1 }).toArray()

    jobs = jobsData.map(job => ({
      _id: job._id.toString(),
      title: job.title,
      description: job.description,
      createdAt: job.createdAt,
      candidates: job.candidates || []
    }))
  } catch (error) {
    console.error('Error fetching jobs:', error)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

        <div className="space-y-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Posted on {formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  <div className="ml-6 flex flex-col gap-2">
                    <a
                      href={`/jobs/${job._id}`}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))
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
      </div>


    </div>
  )
}
