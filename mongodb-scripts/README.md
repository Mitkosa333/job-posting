# MongoDB Mock Data Scripts

This folder contains MongoDB scripts to create mock data for the job board application.

## Prerequisites

- MongoDB installed and running
- MongoDB shell (`mongosh`) or MongoDB Compass
- Access to the `job-board` database

## Script Overview

| Script | Purpose | Run Order |
|--------|---------|-----------|
| `00-setup-database.js` | Initialize database, collections, and indexes | 1st |
| `01-create-jobs.js` | Create sample job postings | 2nd |
| `02-create-candidates.js` | Create sample candidate applications | 3rd |
| `03-link-candidates-to-jobs.js` | Link ALL candidates to ALL jobs with percentage scores | 4th |
| `04-cleanup-data.js` | Verify data integrity and cleanup (optional) | 5th |

## How to Run

### Option 1: Using MongoDB Shell (mongosh)

```bash
# Make sure MongoDB is running
mongod

# Run scripts in order
mongosh mongodb://localhost:27017 --file 00-setup-database.js
mongosh mongodb://localhost:27017 --file 01-create-jobs.js
mongosh mongodb://localhost:27017 --file 02-create-candidates.js
mongosh mongodb://localhost:27017 --file 03-link-candidates-to-jobs.js
mongosh mongodb://localhost:27017 --file 04-cleanup-data.js
```

### Option 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your MongoDB instance
3. Open the MongoDB shell (at the bottom of the interface)
4. Copy and paste each script content in order
5. Execute each script

### Option 3: All at Once Script

```bash
# Run all scripts in sequence
for script in 00-setup-database.js 01-create-jobs.js 02-create-candidates.js 03-link-candidates-to-jobs.js 04-cleanup-data.js; do
  echo "Running $script..."
  mongosh mongodb://localhost:27017 --file "$script"
  echo "✅ $script completed"
  echo ""
done
```

## What Gets Created

### Jobs Collection
- **6 sample jobs** with realistic titles and descriptions:
  - Software Engineer
  - Marketing Manager
  - Customer Service Representative
  - Data Analyst
  - Project Manager
  - Graphic Designer

### Candidates Collection
- **10 sample candidates** with:
  - First and last names
  - Email addresses
  - Phone numbers
  - Professional resume text (experience, skills, education)
  - Application timestamps

### Job-Candidate Relationships
- Each job gets **ALL 10 candidates**
- Each candidate is linked to **ALL 6 jobs**
- **Realistic percentage distribution:**
  - 70% of candidates score 15-49% (below qualification threshold)
  - 30% of candidates score 50-95% (qualified candidates)
- Complete application matrix with realistic filtering

## Database Schema

### Jobs
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  candidates: [{
    candidateId: ObjectId (ref to Candidate),
    percentage: Number (0-100)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Candidates
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String,
  resume: String (required), // Professional resume text
  submittedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes Created

### Jobs Collection
- Text index on `title` and `description`
- Index on `createdAt` (descending)
- Index on `candidates.candidateId`
- Index on `candidates.percentage` (descending)

### Candidates Collection
- Unique index on `email`
- Index on `submittedAt` (descending)
- Compound index on `firstName` and `lastName`
- Index on `createdAt` (descending)

## Verification

After running all scripts, you should see:

```
📊 Final Database Statistics:
============================
📝 Total Jobs: 6
👥 Total Candidates: 10
📋 Total Applications: 60 (every candidate linked to every job)
📈 Average Applications per Job: 10.0
📈 Average Qualified Candidates per Job: ~3.0 (30% above 50%)
📭 Jobs without Applications: 0
🏆 Percentage Distribution: 70% below 50%, 30% above 50%
```

## Cleanup

To start fresh, run:

```javascript
use('job-board');
db.jobs.drop();
db.candidates.drop();
db.applications.drop();
db.metadata.drop();
```

Or simply re-run `00-setup-database.js` which includes cleanup.

## Application Features

The mock data supports testing of:

### Resume System
- **Text-based resumes** instead of file uploads
- **Professional content** for each candidate with realistic experience
- **Searchable content** - resumes are stored as text in the database
- **Easy display** - full resume text shown in candidate detail pages

### Candidate Filtering
- **Qualification threshold** at 50% match score
- **Realistic distribution** - most candidates don't qualify
- **Dynamic displays** - only qualified candidates shown in job listings
- **Expand/collapse** functionality for viewing all qualified candidates

### Data Relationships
- **Complete matrix** - every candidate applies to every job
- **Varying match scores** - realistic percentage distributions
- **Professional profiles** - diverse backgrounds and experience levels

## Environment Variables

Make sure your `.env` file has the correct MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/job-board
```

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string in your app
- Verify database permissions

### Script Errors
- Run scripts in order (dependencies exist)
- Check MongoDB shell syntax
- Ensure database exists and is accessible

### Data Issues
- Run `04-cleanup-data.js` to fix common problems
- Check for unique constraint violations (emails)
- Verify ObjectId references are valid

## Next Steps

After creating mock data:

1. Start your Next.js application: `npm run dev`
2. Visit `/recruiter` to see job listings with qualified candidates
3. Visit `/jobs/[id]` to see individual job details
4. Click on candidates to view their detailed profiles and resume text
5. Submit new applications via the homepage form (text-based resume)
6. Test the expand/collapse functionality for candidate lists

The application will now display realistic candidate data with professional resumes and proper filtering!
