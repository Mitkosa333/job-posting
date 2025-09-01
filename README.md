# Job Board Application

A modern job board application built with Next.js 14, TypeScript, and MongoDB.

## Features

- 🏠 **Home Page**: Beautiful landing page with job search functionality
- 📋 **Job Listings**: Browse and filter available jobs
- ➕ **Post Jobs**: Simple form to post new job opportunities
- 🗄️ **MongoDB Integration**: Database support for storing jobs
- 🎨 **Modern UI**: Built with Tailwind CSS for responsive design
- 🔍 **Search & Filter**: Search jobs by title, location, and type
- 📱 **Responsive**: Mobile-friendly design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd job-board
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Update your environment variables in \`.env.local\`:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/job-board
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
job-board/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── jobs/              # Jobs listing page
│   ├── post-job/          # Job posting page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility libraries
│   ├── mongodb.ts         # MongoDB connection (native driver)
│   └── mongoose.ts        # Mongoose connection
├── models/                # Database models
│   └── Job.ts             # Job model schema
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
\`\`\`

## API Endpoints

- \`GET /api/jobs\` - Fetch all jobs
- \`POST /api/jobs\` - Create a new job

## Database Schema

### Job Model
\`\`\`typescript
{
  title: string           // Required
  company: string         // Required
  location: string        // Required
  type: string           // Required (full-time, part-time, contract, internship)
  salary?: string        // Optional
  description: string    // Required
  requirements?: string  // Optional
  contactEmail: string   // Required
  isActive: boolean      // Default: true
  createdAt: Date       // Auto-generated
  updatedAt: Date       // Auto-generated
}
\`\`\`

## Development

The application uses:
- MongoDB for data persistence
- Both native MongoDB driver and Mongoose for database operations
- Server-side rendering with Next.js App Router
- TypeScript for type safety
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
