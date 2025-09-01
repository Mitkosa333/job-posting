# Job Board Application

A modern job board application built with Next.js 14, TypeScript, and MongoDB.

## Features

- 🏠 **Homepage Application Form**: Streamlined job application form for candidates
- 👔 **Recruiter Dashboard**: Comprehensive dashboard for recruiters to manage job postings
- ➕ **Job Posting**: Simple form for recruiters to post new job opportunities
- 📋 **Job Details**: Detailed job view pages with application tracking
- 🗄️ **MongoDB Integration**: Full database support for jobs, candidates, and applications
- 🤖 **AI-Powered Matching**: Automatic candidate-job matching using OpenAI GPT-3.5 Turbo
- 🎨 **Modern UI**: Built with Tailwind CSS for responsive design
- 📱 **Responsive**: Mobile-friendly design throughout
- 🔄 **Real-time Data**: Dynamic content with server-side rendering

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with both native driver and Mongoose ODM
- **AI**: OpenAI GPT-3.5 Turbo for intelligent candidate matching
- **API**: Next.js API Routes
- **Resume Processing**: Text-based resume system with AI analysis

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd job-board
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   touch .env
   ```

4. Add your environment variables to `.env`:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/job-board
   
   # OpenAI Configuration (Required for automatic candidate matching)
   # Get your API key from: https://platform.openai.com/api-keys
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Set up mock data (optional but recommended):
   ```bash
   # Run MongoDB scripts in order
   mongosh mongodb://localhost:27017 --file mongodb-scripts/00-setup-database.js
   mongosh mongodb://localhost:27017 --file mongodb-scripts/01-create-jobs.js
   mongosh mongodb://localhost:27017 --file mongodb-scripts/02-create-candidates.js
   mongosh mongodb://localhost:27017 --file mongodb-scripts/03-link-candidates-to-jobs.js
   mongosh mongodb://localhost:27017 --file mongodb-scripts/04-cleanup-data.js
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
job-board/
├── app/                       # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── applications/     # Application submission endpoint
│   │   └── jobs/            # Job CRUD endpoints
│   ├── jobs/                # Dynamic job detail pages
│   │   └── [id]/           # Individual job view
│   ├── recruiter/           # Recruiter section
│   │   ├── post-job/       # Job posting form
│   │   └── page.tsx        # Recruiter dashboard
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with navigation
│   └── page.tsx            # Homepage application form
├── lib/                     # Utility libraries
│   ├── mongodb.ts          # MongoDB connection (native driver)
│   └── mongoose.ts         # Mongoose connection
├── models/                  # Database models
│   ├── Job.ts              # Job model schema
│   └── Candidate.ts        # Candidate model schema
├── mongodb-scripts/         # Mock data generation scripts
│   ├── 00-setup-database.js
│   ├── 01-create-jobs.js
│   ├── 02-create-candidates.js
│   ├── 03-link-candidates-to-jobs.js
│   ├── 04-cleanup-data.js
│   └── README.md
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Application Flow

### For Job Seekers
1. **Homepage** (`/`) - Fill out application form with personal info and CV upload
2. **Job Details** (`/jobs/[id]`) - View detailed job descriptions and requirements

### For Recruiters
1. **Dashboard** (`/recruiter`) - View all job postings with application counts
2. **Post Jobs** (`/recruiter/post-job`) - Create new job postings
3. **Job Management** - View applications and candidate details

## API Endpoints

- `GET /api/jobs` - Fetch all jobs with application counts
- `POST /api/jobs` - Create a new job posting
- `POST /api/applications` - Submit job application with CV upload

## Database Schema

### Job Model
```typescript
{
  title: string              // Required - job title
  description: string        // Required - detailed job description
  candidates: [{             // Array of applicants
    candidateId: ObjectId,   // Reference to Candidate document
    percentage?: number      // Match percentage (0-100)
  }],
  createdAt: Date           // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

### Candidate Model
```typescript
{
  firstName: string         // Required
  lastName: string          // Required
  email: string            // Required, unique
  phone?: string           // Optional
  resume: string           // Required - resume text content
  submittedAt: Date        // Application submission time
  createdAt: Date         // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

## Mock Data

The application includes comprehensive MongoDB scripts to generate realistic test data:

- **6 job postings** across various industries
- **10 candidate profiles** with professional resume text
- **60 total applications** (every candidate linked to every job)
- **AI-powered percentage scores** using OpenAI GPT-3.5 Turbo
- **Realistic distribution** (70% below 50%, 30% above 50% threshold)
- **Proper database indexes** for optimal performance

See `mongodb-scripts/README.md` for detailed setup instructions.

## OpenAI Integration

### Automatic Candidate-Job Matching
- **New Candidate Applications**: Automatically analyzed against all existing jobs
- **New Job Postings**: Automatically matched against all existing candidates
- **Real-time AI Analysis**: Uses GPT-3.5 Turbo for intelligent percentage scoring
- **Graceful Fallbacks**: Application continues to work without OpenAI API key

### AI-Powered Features
- **Resume Analysis**: Expert recruiter-level evaluation of candidate fit
- **Bi-directional Matching**: Both candidates and jobs get AI-calculated percentages
- **Intelligent Filtering**: Only candidates above 50% match threshold displayed
- **No Fake Data**: Real AI percentages only, no fallback random numbers

## Key Features

### Application Form (Homepage)
- Server-side rendered form with proper validation
- Text-based resume input with professional content
- Success/error message handling
- Clean, professional design

### Recruiter Dashboard
- Real-time job listing with application counts
- Quick job posting access
- Job detail navigation
- Empty state handling

### Job Detail Pages
- Dynamic routing for individual jobs
- Full job descriptions
- Application count display
- Back navigation to dashboard

### Database Integration
- MongoDB native driver for basic operations
- Mongoose ODM for schema validation
- Proper indexing for performance
- Data relationship management

## Development

The application uses:
- **Server-side rendering** with Next.js App Router for better SEO and performance
- **MongoDB** for data persistence with both native driver and Mongoose
- **OpenAI GPT-3.5 Turbo** for intelligent candidate-job matching
- **TypeScript** for type safety throughout the application
- **Tailwind CSS** for consistent, responsive styling
- **Form handling** with both client-side and server-side approaches
- **Text-based resume system** with AI analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with mock data
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).