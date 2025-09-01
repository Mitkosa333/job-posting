export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Recruiter Portal</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="/recruiter" className="hover:text-blue-200 transition-colors">
                  Dashboard
                </a>
                <a href="/recruiter/post-job" className="hover:text-blue-200 transition-colors">
                  Post a Job
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-blue-200 hover:text-white transition-colors">
                ← Back to Job Board
              </a>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
