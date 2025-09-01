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
  - CV filenames
  - Application timestamps

### Job-Candidate Relationships
- Each job gets **ALL 10 candidates**
- Each candidate is linked to **ALL 6 jobs**
- Each job-candidate pair gets a **random percentage score (60-100%)**
- Complete application matrix for comprehensive testing

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
  cvFileName: String (required),
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
📭 Jobs without Applications: 0
🏆 Most Popular Job: All jobs have equal applications (10 each)
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
2. Visit `/recruiter` to see job listings
3. Visit `/jobs/[id]` to see job details
4. Submit applications via the homepage form
5. Check MongoDB to see real data integration

The application will now display your mock data instead of showing empty states!
