// MongoDB script to create sample candidates (job applications)
// Run this in MongoDB shell or MongoDB Compass

// Switch to job-board database
use('job-board');

// Insert sample candidates
db.candidates.insertMany([
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    resume: "Senior Software Engineer with 8+ years of experience in full-stack development. Proficient in JavaScript, React, Node.js, and Python. Led teams of 5+ developers on enterprise applications. Strong background in agile methodologies and cloud technologies (AWS, Docker). Passionate about clean code and scalable architecture.",
    aiProcessed: false,
    contacted: true,
    contactedAt: new Date('2024-01-17T14:30:00Z'),
    contactNotes: "Spoke with candidate about senior developer position. Very interested and available for interview next week. Strong technical background.",
    submittedAt: new Date('2024-01-16T09:30:00Z'),
    createdAt: new Date('2024-01-16T09:30:00Z'),
    updatedAt: new Date('2024-01-17T14:30:00Z')
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0456",
    resume: "Marketing Manager with 6 years of experience in digital marketing and brand strategy. Expert in SEO, social media marketing, and content creation. Managed marketing budgets of $500K+ and increased brand awareness by 40%. Bachelor's degree in Marketing from State University. Certified Google Ads and Analytics professional.",
    aiProcessed: false,
    contacted: false,
    submittedAt: new Date('2024-01-15T14:20:00Z'),
    createdAt: new Date('2024-01-15T14:20:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z')
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@email.com",
    phone: "+1-555-0789",
    resume: "Customer Service Representative with 4 years of experience in retail and call center environments. Excellent communication skills and conflict resolution abilities. Consistently achieved 95%+ customer satisfaction ratings. Experienced with CRM systems and multi-channel support. Fluent in English and Spanish.",
    aiProcessed: false,
    contacted: true,
    contactedAt: new Date('2024-01-15T10:15:00Z'),
    contactNotes: "Initial phone screening completed. Good communication skills but may be overqualified for entry-level positions.",
    submittedAt: new Date('2024-01-14T11:45:00Z'),
    createdAt: new Date('2024-01-14T11:45:00Z'),
    updatedAt: new Date('2024-01-15T10:15:00Z')
  },
  {
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@email.com",
    phone: "+1-555-0234",
    resume: "Data Analyst with 5 years of experience in business intelligence and statistical analysis. Proficient in SQL, Python, R, and Tableau. Created automated reporting systems that saved 20+ hours per week. Master's degree in Statistics. Strong background in A/B testing and predictive modeling.",
    aiProcessed: false,
    contacted: false,
    submittedAt: new Date('2024-01-13T16:10:00Z'),
    createdAt: new Date('2024-01-13T16:10:00Z'),
    updatedAt: new Date('2024-01-13T16:10:00Z')
  },
  {
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@email.com",
    phone: "+1-555-0567",
    resume: "Project Manager with 7 years of experience managing cross-functional teams and complex projects. PMP certified with expertise in Agile and Waterfall methodologies. Successfully delivered 50+ projects on time and under budget. Strong leadership and communication skills. Experience in both IT and construction industries.",
    aiProcessed: false,
    contacted: false,
    submittedAt: new Date('2024-01-12T10:30:00Z'),
    createdAt: new Date('2024-01-12T10:30:00Z'),
    updatedAt: new Date('2024-01-12T10:30:00Z')
  },
  {
    firstName: "Lisa",
    lastName: "Garcia",
    email: "lisa.garcia@email.com",
    phone: "+1-555-0890",
    resume: "Graphic Designer with 5 years of experience in brand identity and digital design. Proficient in Adobe Creative Suite, Figma, and Sketch. Created award-winning campaigns for Fortune 500 companies. Bachelor's degree in Graphic Design. Specialized in UI/UX design and print media. Portfolio includes web design, logos, and marketing materials.",
    aiProcessed: false,
    contacted: false,
    submittedAt: new Date('2024-01-11T15:45:00Z'),
    createdAt: new Date('2024-01-11T15:45:00Z'),
    updatedAt: new Date('2024-01-11T15:45:00Z')
  },
  {
    firstName: "Robert",
    lastName: "Martinez",
    email: "robert.martinez@email.com",
    phone: "+1-555-0345",
    resume: "Sales Manager with 10 years of experience in B2B and B2C sales. Consistently exceeded sales targets by 20%+ for 5 consecutive years. Managed sales teams of 8-12 representatives. Expert in CRM systems (Salesforce, HubSpot) and lead generation. Strong negotiation and relationship building skills.",
    aiProcessed: false,
    contacted: false,
    submittedAt: new Date('2024-01-10T12:20:00Z'),
    createdAt: new Date('2024-01-10T12:20:00Z'),
    updatedAt: new Date('2024-01-10T12:20:00Z')
  },
  {
    firstName: "Jessica",
    lastName: "Anderson",
    email: "jessica.anderson@email.com",
    phone: "+1-555-0678",
    resume: "Human Resources Specialist with 6 years of experience in recruitment, employee relations, and HR policy development. Successfully recruited 200+ candidates across various departments. Expert in employment law and compliance. SHRM certified. Strong background in performance management and training programs.",
    aiProcessed: false,
    contacted: false,
    submittedAt: new Date('2024-01-09T08:15:00Z'),
    createdAt: new Date('2024-01-09T08:15:00Z'),
    updatedAt: new Date('2024-01-09T08:15:00Z')
  },
  {
    firstName: "Christopher",
    lastName: "Taylor",
    email: "christopher.taylor@email.com",
    phone: "+1-555-0901",
    resume: "Financial Analyst with 4 years of experience in corporate finance and investment analysis. CFA Level II candidate. Proficient in financial modeling, valuation, and risk assessment. Created financial reports and presentations for C-level executives. Strong analytical skills with expertise in Excel, Bloomberg, and FactSet.",
    aiProcessed: false,
    contacted: false,
    submittedAt: new Date('2024-01-08T13:40:00Z'),
    createdAt: new Date('2024-01-08T13:40:00Z'),
    updatedAt: new Date('2024-01-08T13:40:00Z')
  },
  {
    firstName: "Amanda",
    lastName: "Thomas",
    email: "amanda.thomas@email.com",
    phone: "+1-555-0123",
    resume: "Operations Manager with 8 years of experience optimizing business processes and supply chain management. Reduced operational costs by 15% through process improvements. Led cross-functional teams and managed vendor relationships. Bachelor's degree in Business Administration. Six Sigma Green Belt certified.",
    aiProcessed: false,
    contacted: false,
    submittedAt: new Date('2024-01-07T17:25:00Z'),
    createdAt: new Date('2024-01-07T17:25:00Z'),
    updatedAt: new Date('2024-01-07T17:25:00Z')
  }
]);

print("✅ Sample candidates created successfully!");
print("📊 Total candidates inserted:", db.candidates.countDocuments());
