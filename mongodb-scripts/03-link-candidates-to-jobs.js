// MongoDB script to link candidates to jobs with percentage scores
// Run this AFTER creating jobs and candidates
// Run this in MongoDB shell or MongoDB Compass

// Switch to job-board database
use('job-board');

// First, get all job and candidate IDs
const jobs = db.jobs.find({}).toArray();
const candidates = db.candidates.find({}).toArray();

if (jobs.length === 0 || candidates.length === 0) {
  print("❌ Error: No jobs or candidates found. Please run the previous scripts first.");
} else {
  print("📋 Found", jobs.length, "jobs and", candidates.length, "candidates");
  
  // Add ALL candidates to ALL jobs with random percentage scores
  jobs.forEach((job, jobIndex) => {
    const jobCandidates = [];
    
    // Add every candidate to this job
    candidates.forEach(candidate => {
      jobCandidates.push({
        candidateId: candidate._id,
        percentage: Math.floor(Math.random() * 41) + 60 // Random percentage between 60-100
      });
    });
    
    // Update the job with all candidates
    db.jobs.updateOne(
      { _id: job._id },
      { $set: { candidates: jobCandidates } }
    );
    
    print(`✅ Added ${jobCandidates.length} candidates to job: "${job.title}"`);
  });
}

print("\n📊 Final Statistics:");
print("Jobs with applications:", db.jobs.countDocuments({ "candidates.0": { $exists: true } }));

// Display summary of applications per job
const jobSummary = db.jobs.aggregate([
  {
    $project: {
      title: 1,
      applicationCount: { $size: { $ifNull: ["$candidates", []] } }
    }
  }
]).toArray();

print("\n📈 Applications per job:");
jobSummary.forEach(job => {
  print(`• ${job.title}: ${job.applicationCount} applications`);
});

print("\n🎉 Mock data setup completed successfully!");
