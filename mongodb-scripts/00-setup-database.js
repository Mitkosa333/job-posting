// MongoDB script to set up the job-board database and collections
// Run this FIRST before other scripts
// Run this in MongoDB shell or MongoDB Compass

// Create and switch to job-board database
use('job-board');

// Drop existing collections if they exist (optional - for clean setup)
db.jobs.drop();
db.candidates.drop();
db.applications.drop();

print("🗑️  Dropped existing collections (if any)");

// Create collections with validation schemas
db.createCollection("jobs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Job Posting Schema",
      required: ["title", "description"],
      properties: {
        title: {
          bsonType: "string",
          description: "Job title is required and must be a string"
        },
        description: {
          bsonType: "string",
          description: "Job description is required and must be a string"
        },
        candidates: {
          bsonType: "array",
          description: "Array of candidates who applied for this job",
          items: {
            bsonType: "object",
            required: ["candidateId"],
            properties: {
              candidateId: {
                bsonType: "objectId",
                description: "Reference to candidate document"
              },
              percentage: {
                bsonType: "number",
                minimum: 0,
                maximum: 100,
                description: "Candidate match percentage (0-100)"
              }
            }
          }
        },
        aiProcessed: {
          bsonType: "bool",
          description: "Whether OpenAI processing has been completed for this job"
        },
        createdAt: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.createCollection("candidates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Candidate Schema",
      required: ["firstName", "lastName", "email", "resume"],
      properties: {
        firstName: {
          bsonType: "string",
          description: "First name is required and must be a string"
        },
        lastName: {
          bsonType: "string",
          description: "Last name is required and must be a string"
        },
        email: {
          bsonType: "string",
          pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
          description: "Valid email address is required"
        },
        phone: {
          bsonType: "string",
          description: "Phone number (optional)"
        },
        resume: {
          bsonType: "string",
          description: "Resume text is required"
        },
        submittedAt: {
          bsonType: "date",
          description: "Application submission timestamp"
        },
        aiProcessed: {
          bsonType: "bool",
          description: "Whether OpenAI processing has been completed for this candidate"
        },
        createdAt: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

// Create indexes for better performance
print("📊 Creating indexes...");

// Jobs collection indexes
db.jobs.createIndex({ "title": "text", "description": "text" });
db.jobs.createIndex({ "createdAt": -1 });
db.jobs.createIndex({ "candidates.candidateId": 1 });
db.jobs.createIndex({ "candidates.percentage": -1 });
db.jobs.createIndex({ "aiProcessed": 1 });

// Candidates collection indexes
db.candidates.createIndex({ "email": 1 }, { unique: true });
db.candidates.createIndex({ "submittedAt": -1 });
db.candidates.createIndex({ "firstName": 1, "lastName": 1 });
db.candidates.createIndex({ "createdAt": -1 });
db.candidates.createIndex({ "aiProcessed": 1 });

print("✅ Database setup completed!");
print("📚 Collections created: jobs, candidates");
print("🔍 Indexes created for optimal performance");
print("📋 Schema validation enabled");
print("\nNext steps:");
print("1. Run 01-create-jobs.js");
print("2. Run 02-create-candidates.js");
print("3. Run 03-link-candidates-to-jobs.js");
print("4. Run 04-cleanup-data.js (optional)");
