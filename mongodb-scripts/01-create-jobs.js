// MongoDB script to create sample job postings
// Run this in MongoDB shell or MongoDB Compass

// Switch to job-board database
use('job-board');

// Insert sample jobs
db.jobs.insertMany([
  {
    title: "Software Engineer",
    description: `We are looking for a talented Software Engineer to join our growing development team. You will be responsible for designing, developing, and maintaining high-quality software applications.

Key Responsibilities:
• Develop and maintain web applications using modern technologies
• Collaborate with cross-functional teams to deliver quality software
• Write clean, maintainable, and efficient code
• Participate in code reviews and technical discussions
• Troubleshoot and debug applications
• Stay up-to-date with emerging technologies and best practices

Requirements:
• Bachelor's degree in Computer Science or related field
• 2+ years of experience in software development
• Proficiency in at least one programming language (JavaScript, Python, Java, etc.)
• Experience with web development frameworks
• Strong problem-solving skills
• Excellent communication and teamwork abilities
• Ability to work in a fast-paced environment

What We Offer:
• Competitive salary and benefits
• Flexible working arrangements
• Professional development opportunities
• Collaborative and innovative work environment
• Health and wellness programs`,
    candidates: [],
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    title: "Marketing Manager",
    description: `Join our dynamic marketing team as a Marketing Manager and help drive our brand growth and customer engagement strategies.

Key Responsibilities:
• Develop and execute comprehensive marketing campaigns
• Manage social media presence and digital marketing initiatives
• Analyze market trends and competitor activities
• Collaborate with sales team to generate leads
• Create compelling content for various marketing channels
• Monitor and report on campaign performance
• Manage marketing budget and vendor relationships

Requirements:
• Bachelor's degree in Marketing, Business, or related field
• 3+ years of experience in marketing or related role
• Strong understanding of digital marketing tools and platforms
• Excellent written and verbal communication skills
• Creative thinking and problem-solving abilities
• Experience with marketing analytics and reporting
• Ability to manage multiple projects simultaneously

Benefits:
• Competitive salary package
• Performance-based bonuses
• Health insurance coverage
• Paid time off and holidays
• Professional development budget
• Modern office environment
• Team building activities`,
    candidates: [],
    createdAt: new Date('2024-01-10T14:30:00Z'),
    updatedAt: new Date('2024-01-10T14:30:00Z')
  },
  {
    title: "Customer Service Representative",
    description: `We are seeking a friendly and professional Customer Service Representative to provide excellent support to our valued customers.

Key Responsibilities:
• Handle customer inquiries via phone, email, and chat
• Resolve customer complaints and issues promptly
• Process orders, returns, and exchanges
• Maintain accurate customer records
• Provide product information and recommendations
• Escalate complex issues to appropriate departments
• Follow up with customers to ensure satisfaction

Requirements:
• High school diploma or equivalent
• 1+ years of customer service experience preferred
• Excellent communication and interpersonal skills
• Strong problem-solving abilities
• Patience and empathy when dealing with customers
• Basic computer skills and familiarity with CRM systems
• Ability to work in a team environment
• Flexible schedule availability

What We Provide:
• Comprehensive training program
• Competitive hourly wage
• Health and dental benefits
• Employee discount program
• Opportunities for advancement
• Supportive team environment
• Recognition and reward programs`,
    candidates: [],
    createdAt: new Date('2024-01-08T09:15:00Z'),
    updatedAt: new Date('2024-01-08T09:15:00Z')
  },
  {
    title: "Data Analyst",
    description: `We are looking for a detail-oriented Data Analyst to help transform data into actionable business insights.

Key Responsibilities:
• Collect, analyze, and interpret large datasets
• Create reports and dashboards for stakeholders
• Identify trends, patterns, and anomalies in data
• Develop and maintain data models and databases
• Collaborate with various departments to understand data needs
• Present findings and recommendations to management
• Ensure data quality and integrity

Requirements:
• Bachelor's degree in Statistics, Mathematics, Computer Science, or related field
• 2+ years of experience in data analysis
• Proficiency in SQL and data visualization tools (Tableau, Power BI)
• Experience with programming languages (Python, R) is a plus
• Strong analytical and critical thinking skills
• Excellent attention to detail
• Ability to communicate complex data insights clearly

Benefits:
• Competitive salary
• Health and wellness benefits
• Retirement savings plan
• Flexible work arrangements
• Learning and development opportunities
• Modern technology and tools
• Collaborative work environment`,
    candidates: [],
    createdAt: new Date('2024-01-05T11:45:00Z'),
    updatedAt: new Date('2024-01-05T11:45:00Z')
  },
  {
    title: "Project Manager",
    description: `Join our team as a Project Manager and lead cross-functional teams to deliver successful projects on time and within budget.

Key Responsibilities:
• Plan, execute, and monitor project timelines and deliverables
• Coordinate with stakeholders and team members
• Manage project budgets and resources
• Identify and mitigate project risks
• Facilitate meetings and communication
• Ensure project quality and compliance
• Prepare project reports and documentation

Requirements:
• Bachelor's degree in Business, Engineering, or related field
• 3+ years of project management experience
• PMP certification preferred
• Strong organizational and leadership skills
• Excellent communication and presentation abilities
• Experience with project management tools (Jira, Asana, MS Project)
• Ability to work under pressure and meet deadlines
• Problem-solving and decision-making skills

What We Offer:
• Competitive salary and bonus structure
• Comprehensive benefits package
• Professional certification support
• Career advancement opportunities
• Flexible working options
• Team building and social events
• Cutting-edge project management tools`,
    candidates: [],
    createdAt: new Date('2024-01-03T16:20:00Z'),
    updatedAt: new Date('2024-01-03T16:20:00Z')
  },
  {
    title: "Graphic Designer",
    description: `We are seeking a creative Graphic Designer to join our design team and help create visually compelling content for our brand.

Key Responsibilities:
• Design marketing materials, brochures, and advertisements
• Create digital content for websites and social media
• Develop brand guidelines and visual identity materials
• Collaborate with marketing and product teams
• Manage multiple design projects simultaneously
• Ensure brand consistency across all materials
• Stay current with design trends and software

Requirements:
• Bachelor's degree in Graphic Design or related field
• 2+ years of professional design experience
• Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)
• Strong portfolio demonstrating design skills
• Understanding of typography, color theory, and layout principles
• Ability to work independently and meet deadlines
• Strong attention to detail and creativity

Benefits:
• Creative and inspiring work environment
• Competitive salary
• Health and dental insurance
• Professional development opportunities
• Latest design software and equipment
• Flexible schedule
• Collaborative team culture`,
    candidates: [],
    createdAt: new Date('2024-01-01T13:10:00Z'),
    updatedAt: new Date('2024-01-01T13:10:00Z')
  }
]);

print("✅ Sample jobs created successfully!");
print("📊 Total jobs inserted:", db.jobs.countDocuments());
