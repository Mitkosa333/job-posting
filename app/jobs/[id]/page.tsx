interface JobDetailPageProps {
  params: { id: string }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  // In a real application, you would fetch the job by ID from your database
  // For now, we'll use mock data based on the ID
  const jobId = parseInt(params.id)
  
  // Mock job data - in reality this would come from your database
  const mockJobs = {
    1: {
      id: 1,
      title: "Senior Frontend Developer",
      shortDescription: "We're looking for a senior frontend developer to join our team...",
      fullDescription: `We are seeking a highly skilled Senior Frontend Developer to join our dynamic development team. In this role, you will be responsible for creating exceptional user experiences using modern web technologies.

Key Responsibilities:
• Lead the development of responsive, high-performance web applications
• Collaborate with UX/UI designers to implement pixel-perfect designs
• Mentor junior developers and conduct code reviews
• Optimize applications for maximum speed and scalability
• Stay up-to-date with emerging frontend technologies and best practices
• Participate in agile development processes and sprint planning

Technical Requirements:
• 5+ years of experience in frontend development
• Expert-level knowledge of React, JavaScript (ES6+), and TypeScript
• Proficiency with modern CSS frameworks (Tailwind CSS, styled-components)
• Experience with state management libraries (Redux, Zustand, Context API)
• Familiar with build tools (Webpack, Vite) and package managers (npm, yarn)
• Understanding of RESTful APIs and GraphQL
• Experience with testing frameworks (Jest, React Testing Library)
• Knowledge of version control systems (Git) and CI/CD pipelines

What We Offer:
• Competitive salary range: $120,000 - $160,000
• Comprehensive health, dental, and vision insurance
• 401(k) plan with company matching
• Flexible work arrangements (hybrid/remote options)
• Professional development budget ($2,000 annually)
• Unlimited PTO policy
• Modern office space in downtown San Francisco
• Team building events and company retreats

About Our Company:
We are a fast-growing tech startup that is revolutionizing the way people interact with digital products. Our team of 50+ talented individuals is passionate about creating innovative solutions that make a real impact. We value diversity, creativity, and continuous learning.

How to Apply:
Submit your application through our job board with your CV attached. We review applications on a rolling basis and aim to respond within 5 business days.`,
      postedAt: "2 days ago"
    },
    2: {
      id: 2,
      title: "Backend Engineer",
      shortDescription: "Join our backend team and help build scalable systems...",
      fullDescription: `We are looking for a talented Backend Engineer to join our growing engineering team. You will be responsible for designing, developing, and maintaining robust backend systems that power our applications.

Key Responsibilities:
• Design and implement scalable backend services and APIs
• Work with databases to ensure optimal performance and data integrity
• Collaborate with frontend developers to integrate user-facing elements
• Implement security best practices and data protection measures
• Optimize application performance and troubleshoot issues
• Participate in system architecture decisions and technical planning
• Write clean, maintainable, and well-documented code

Technical Requirements:
• 3+ years of experience in backend development
• Proficiency in Node.js, Python, or Java
• Experience with RESTful API design and development
• Strong knowledge of databases (PostgreSQL, MongoDB, MySQL)
• Familiarity with cloud platforms (AWS, Google Cloud, Azure)
• Understanding of microservices architecture
• Experience with containerization (Docker, Kubernetes)
• Knowledge of testing frameworks and TDD practices

What We Offer:
• Competitive salary: $100,000 - $140,000
• 100% remote work opportunity
• Health and dental insurance coverage
• 401(k) retirement plan
• Flexible working hours across time zones
• Annual team meetups and conferences
• Learning and development stipend
• Home office setup budget

About the Role:
This is a fully remote position that offers the flexibility to work from anywhere. You'll be joining a distributed team of engineers who are passionate about building high-quality software. We use modern development practices including continuous integration, automated testing, and regular code reviews.

Growth Opportunities:
• Lead technical initiatives and mentor junior developers
• Contribute to open-source projects
• Speak at conferences and technical meetups
• Shape the technical direction of our products

Application Process:
Please submit your CV along with any relevant project links or portfolio. We value practical experience and problem-solving skills over formal credentials.`,
      postedAt: "1 week ago"
    },
    3: {
      id: 3,
      title: "Full Stack Developer",
      shortDescription: "Work on exciting client projects with modern technologies...",
      fullDescription: `We are seeking a versatile Full Stack Developer to work on diverse client projects for our digital agency. This contract position offers the opportunity to work with cutting-edge technologies and deliver innovative solutions for our clients.

Key Responsibilities:
• Develop end-to-end web applications using modern frameworks
• Work directly with clients to understand requirements and deliver solutions
• Build responsive, mobile-first user interfaces
• Implement backend services and database solutions
• Ensure cross-browser compatibility and optimize performance
• Collaborate with designers and project managers
• Maintain and update existing client applications

Technical Stack:
• Frontend: React, Vue.js, Next.js, TypeScript
• Backend: Node.js, Express, Django, FastAPI
• Databases: PostgreSQL, MongoDB, Firebase
• Cloud: AWS, Vercel, Netlify
• Tools: Git, Docker, Figma integration

Project Types:
• E-commerce platforms and marketplaces
• Content management systems
• Custom web applications for enterprises
• Progressive web apps (PWAs)
• API integrations and third-party services

Contract Details:
• 6-12 month contract with potential for extension
• Competitive hourly rate: $40-60/hour (equivalent to $80k-$120k annually)
• Hybrid work model (3 days in NYC office, 2 days remote)
• Direct collaboration with high-profile clients
• Opportunity to work on 2-3 projects simultaneously

What We Provide:
• Access to latest development tools and software licenses
• Professional development budget for courses and conferences
• Modern office space in Manhattan with great amenities
• Flexible schedule within core collaboration hours
• Opportunity to build a diverse portfolio of work

Ideal Candidate:
• Self-motivated with excellent time management skills
• Strong communication skills for client interactions
• Adaptable to different project requirements and technologies
• Detail-oriented with a focus on code quality
• Experience with agile development methodologies

Agency Culture:
We are a creative digital agency that values innovation, quality, and client satisfaction. Our team of 25 professionals works on projects ranging from startup MVPs to enterprise-level applications. We believe in work-life balance and maintaining a collaborative, supportive environment.`,
      postedAt: "3 days ago"
    }
  }

  const job = mockJobs[jobId as keyof typeof mockJobs]

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
              Posted {job.postedAt}
            </div>
          </div>

        </div>
      </div>

      {/* Job Content */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {job.fullDescription}
          </div>
        </div>
      </div>
    </div>
  )
}
