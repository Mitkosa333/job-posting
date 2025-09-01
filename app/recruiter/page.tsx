export default function RecruiterDashboard() {

  // This would typically fetch jobs from your MongoDB database
  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "We're looking for a senior frontend developer to join our team...",
      postedAt: "2 days ago"
    },
    {
      id: 2,
      title: "Backend Engineer",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $140k",
      description: "Join our backend team and help build scalable systems...",
      postedAt: "1 week ago"
    },
    {
      id: 3,
      title: "Full Stack Developer",
      location: "New York, NY",
      type: "Contract",
      salary: "$80k - $120k",
      description: "Work on exciting client projects with modern technologies...",
      postedAt: "3 days ago"
    }
  ]

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
          {mockJobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{job.type}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-600">{job.salary}</span>
                    <span className="text-sm text-gray-500">{job.postedAt}</span>
                  </div>
                </div>
                <div className="ml-6 flex flex-col gap-2">
                  <a
                    href={`/jobs/${job.id}`}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
