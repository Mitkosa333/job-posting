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
    cvFileName: "john_smith_resume.pdf",
    submittedAt: new Date('2024-01-16T09:30:00Z'),
    createdAt: new Date('2024-01-16T09:30:00Z'),
    updatedAt: new Date('2024-01-16T09:30:00Z')
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0456",
    cvFileName: "sarah_johnson_cv.pdf",
    submittedAt: new Date('2024-01-15T14:20:00Z'),
    createdAt: new Date('2024-01-15T14:20:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z')
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@email.com",
    phone: "+1-555-0789",
    cvFileName: "michael_brown_resume.pdf",
    submittedAt: new Date('2024-01-14T11:45:00Z'),
    createdAt: new Date('2024-01-14T11:45:00Z'),
    updatedAt: new Date('2024-01-14T11:45:00Z')
  },
  {
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@email.com",
    phone: "+1-555-0234",
    cvFileName: "emily_davis_cv.pdf",
    submittedAt: new Date('2024-01-13T16:10:00Z'),
    createdAt: new Date('2024-01-13T16:10:00Z'),
    updatedAt: new Date('2024-01-13T16:10:00Z')
  },
  {
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@email.com",
    phone: "+1-555-0567",
    cvFileName: "david_wilson_resume.pdf",
    submittedAt: new Date('2024-01-12T10:30:00Z'),
    createdAt: new Date('2024-01-12T10:30:00Z'),
    updatedAt: new Date('2024-01-12T10:30:00Z')
  },
  {
    firstName: "Lisa",
    lastName: "Garcia",
    email: "lisa.garcia@email.com",
    phone: "+1-555-0890",
    cvFileName: "lisa_garcia_cv.pdf",
    submittedAt: new Date('2024-01-11T15:45:00Z'),
    createdAt: new Date('2024-01-11T15:45:00Z'),
    updatedAt: new Date('2024-01-11T15:45:00Z')
  },
  {
    firstName: "Robert",
    lastName: "Martinez",
    email: "robert.martinez@email.com",
    phone: "+1-555-0345",
    cvFileName: "robert_martinez_resume.pdf",
    submittedAt: new Date('2024-01-10T12:20:00Z'),
    createdAt: new Date('2024-01-10T12:20:00Z'),
    updatedAt: new Date('2024-01-10T12:20:00Z')
  },
  {
    firstName: "Jessica",
    lastName: "Anderson",
    email: "jessica.anderson@email.com",
    phone: "+1-555-0678",
    cvFileName: "jessica_anderson_cv.pdf",
    submittedAt: new Date('2024-01-09T08:15:00Z'),
    createdAt: new Date('2024-01-09T08:15:00Z'),
    updatedAt: new Date('2024-01-09T08:15:00Z')
  },
  {
    firstName: "Christopher",
    lastName: "Taylor",
    email: "christopher.taylor@email.com",
    phone: "+1-555-0901",
    cvFileName: "christopher_taylor_resume.pdf",
    submittedAt: new Date('2024-01-08T13:40:00Z'),
    createdAt: new Date('2024-01-08T13:40:00Z'),
    updatedAt: new Date('2024-01-08T13:40:00Z')
  },
  {
    firstName: "Amanda",
    lastName: "Thomas",
    email: "amanda.thomas@email.com",
    phone: "+1-555-0123",
    cvFileName: "amanda_thomas_cv.pdf",
    submittedAt: new Date('2024-01-07T17:25:00Z'),
    createdAt: new Date('2024-01-07T17:25:00Z'),
    updatedAt: new Date('2024-01-07T17:25:00Z')
  }
]);

print("✅ Sample candidates created successfully!");
print("📊 Total candidates inserted:", db.candidates.countDocuments());
