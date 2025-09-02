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
- 🧪 **Comprehensive Testing**: 105+ tests covering all functionality with Jest and React Testing Library

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with both native driver and Mongoose ODM
- **AI**: OpenAI GPT-3.5 Turbo for intelligent candidate matching
- **API**: Next.js API Routes
- **Resume Processing**: Text-based resume system with AI analysis
- **Testing**: Jest, React Testing Library, MongoDB Memory Server (105+ tests)

## Getting Started

You can run this application in two ways: using Docker (recommended) or local development setup.

### Option 1: Docker Setup (Recommended)

#### Prerequisites
- Docker and Docker Compose installed

#### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd job-board
   ```

2. Create environment file:
   ```bash
   touch .env
   ```

3. Add your OpenAI API key to `.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run with Docker Compose:
   ```bash
   # For production build
   docker-compose up -d

   # For development with hot reload
   docker-compose -f docker-compose.dev.yml up -d
   ```

5. Access the application:
   - **Application**: http://localhost:3000
   - **Database UI**: http://localhost:8081 (Mongo Express)
   - **MongoDB**: localhost:27018 (to avoid conflicts with local MongoDB)

6. Initialize with mock data:
   ```bash
   # Access MongoDB container
   docker exec -it job-board-mongodb-dev mongosh -u admin -p password123 --authenticationDatabase admin

   # Or run the initialization scripts directly
   docker exec -it job-board-mongodb-dev mongosh job-board --eval "load('/docker-entrypoint-initdb.d/00-setup-database.js')"
   ```

### Option 2: Local Development Setup

#### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud instance)

#### Installation

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
├── __tests__/               # Comprehensive test suite (105+ tests)
│   ├── api/                # API endpoint business logic tests
│   ├── components/         # React component tests
│   ├── lib/                # Library and utility tests
│   ├── models/             # Database model tests
│   ├── utils/              # Test utilities and helpers
│   └── README.md           # Testing documentation
├── app/                     # Next.js 14 App Router
│   ├── api/                # API routes
│   │   ├── applications/   # Application submission endpoint
│   │   ├── candidates/     # Candidate CRUD endpoints
│   │   │   └── [id]/      # Individual candidate API
│   │   ├── jobs/          # Job CRUD endpoints
│   │   └── processing-status/ # AI processing status API
│   ├── candidates/         # Candidate pages
│   │   └── [id]/          # Individual candidate view
│   ├── jobs/              # Job detail pages
│   │   └── [id]/         # Individual job view
│   ├── recruiter/         # Recruiter section
│   │   ├── layout.tsx    # Recruiter navigation layout
│   │   ├── page.tsx      # Recruiter dashboard
│   │   └── post-job/     # Job posting form
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout with navigation
│   └── page.tsx          # Homepage application form
├── components/            # Reusable React components
│   └── ProcessingStatus.tsx # AI processing status component
├── lib/                   # Utility libraries
│   ├── mongodb.ts        # MongoDB connection (native driver)
│   ├── mongoose.ts       # Mongoose connection
│   └── openai.ts         # OpenAI integration
├── models/                # Database models
│   ├── Job.ts            # Job Mongoose schema
│   └── Candidate.ts      # Candidate Mongoose schema
├── mongodb-scripts/       # Database setup and mock data
│   ├── 00-setup-database.js # Schema creation and indexes
│   ├── 01-create-jobs.js  # Sample job postings
│   ├── 02-create-candidates.js # Sample candidates
│   ├── 03-link-candidates-to-jobs.js # AI percentage linking
│   ├── 04-cleanup-data.js # Data cleanup utilities
│   └── README.md         # Database setup instructions
├── scripts/               # Utility scripts
│   └── docker-setup.sh   # Docker environment setup
├── docker-compose.yml    # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── Dockerfile            # Container definition
├── jest.config.js        # Jest testing configuration
├── jest.setup.js         # Jest setup and mocks
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Application Flow

### For Job Seekers
1. **Homepage** (`/`) - Fill out application form with personal info and resume text
2. **Job Details** (`/jobs/[id]`) - View detailed job descriptions
3. **AI Processing** - Automatic matching against all jobs with percentage scores

### For Recruiters
1. **Dashboard** (`/recruiter`) - View all job postings with qualified candidates
2. **Post Jobs** (`/recruiter/post-job`) - Create new job postings (auto-matched with AI)
3. **Candidate Details** (`/candidates/[id]`) - View individual candidate profiles
4. **AI Matching** - See percentage-based candidate rankings for each job

## API Endpoints

### Jobs
- `GET /api/jobs` - Fetch all jobs with candidate match data
- `POST /api/jobs` - Create a new job posting (triggers AI matching)

### Candidates
- `GET /api/candidates` - Fetch all candidates
- `GET /api/candidates/[id]` - Fetch individual candidate details
- `POST /api/applications` - Submit job application (triggers AI matching)

### Processing Status
- `GET /api/processing-status?candidateId=[id]` - Check AI processing status for a candidate

## Database Schema

### Job Model
```typescript
{
  title: string              // Required - job title
  description: string        // Required - detailed job description
  candidates: [{             // Array of applicants
    candidateId: ObjectId,   // Reference to Candidate document
    percentage: number       // AI-calculated match percentage (0-100)
  }],
  aiProcessed: boolean       // Whether AI analysis has been completed
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
  aiProcessed: boolean      // Whether AI analysis has been completed
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

## Testing

This project includes a comprehensive testing framework with 105+ tests covering all critical functionality.

### Test Framework
- **Jest** - Main testing framework with TypeScript support
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Additional DOM matchers
- **@testing-library/user-event** - User interaction simulation
- **MongoDB Memory Server** - In-memory database for testing
- **OpenAI Mocking** - Complete AI integration testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

**105 Tests Across 8 Test Suites:**

- **✅ Basic Framework Tests** (5 tests)
  - Environment setup and configuration
  - Test utility validation

- **✅ OpenAI Integration Tests** (11 tests)
  - API configuration and validation
  - Mock response handling
  - Error scenarios and rate limiting
  - Integration patterns

- **✅ Model Tests** (50 tests)
  - **Job Model** (33 tests): Creation, validation, queries, AI processing
  - **Candidate Model** (17 tests): Creation, email validation, sorting, virtual properties

- **✅ API Tests** (31 tests)  
  - **Jobs API** (15 tests): Data management, creation logic, AI simulation
  - **Applications API** (16 tests): Form processing, matching, background processing

- **✅ Component Tests** (15 tests)
  - **ProcessingStatus** component: Rendering, polling, error handling, accessibility

### Test Features

- **🚀 Business Logic Focus**: Tests core functionality without external dependencies
- **🎯 Comprehensive Mocking**: Complete simulation of MongoDB and OpenAI services  
- **⚡ Fast Execution**: All tests run in under 2 seconds
- **🛡️ Error Coverage**: Extensive error scenario testing
- **🔄 Async Testing**: Proper handling of timers, promises, and API calls
- **📱 Component Testing**: Full React component behavior validation

### Test Structure

```
__tests__/
├── api/                    # API endpoint business logic tests
│   ├── applications.test.ts
│   └── jobs.test.ts
├── components/             # React component tests
│   └── ProcessingStatus.test.tsx
├── lib/                    # Library and utility tests
│   └── openai.test.ts
├── models/                 # Database model tests
│   ├── Candidate.test.ts
│   └── Job.test.ts
├── utils/                  # Test utilities and helpers
│   └── testHelpers.ts
├── simple.test.ts         # Basic framework validation
└── README.md              # Testing documentation
```

### Key Testing Patterns

- **AAA Pattern**: Arrange, Act, Assert structure
- **Isolated Tests**: Each test is independent with proper cleanup
- **Mock Strategy**: External services mocked for reliability
- **Edge Case Coverage**: Invalid inputs, network errors, rate limits
- **Accessibility Testing**: ARIA attributes and keyboard navigation

## Development

### Docker Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Start production environment
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app
docker-compose logs -f mongodb

# Rebuild application
docker-compose build app

# Access MongoDB shell
docker exec -it job-board-mongodb-dev mongosh -u admin -p password123 --authenticationDatabase admin

# Access application container
docker exec -it job-board-app-dev sh
```

### Local Development

The application uses:
- **Server-side rendering** with Next.js App Router for better SEO and performance
- **MongoDB** for data persistence with both native driver and Mongoose
- **OpenAI GPT-3.5 Turbo** for intelligent candidate-job matching
- **TypeScript** for type safety throughout the application
- **Tailwind CSS** for consistent, responsive styling
- **Form handling** with both client-side and server-side approaches
- **Text-based resume system** with AI analysis

### Troubleshooting

#### Docker Issues
- **Port conflicts**: Change ports in `docker-compose.yml` if 3000, 8081, or 27017 are in use
- **Permission issues**: Ensure Docker has proper permissions on your system
- **Build failures**: Try `docker-compose build --no-cache` for clean rebuild

#### Database Issues
- **Connection errors**: Verify MongoDB container is running with `docker-compose ps`
- **Data persistence**: Database data is stored in Docker volumes and persists between restarts
- **Reset data**: Remove volumes with `docker-compose down -v` (⚠️ This deletes all data)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with mock data
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).