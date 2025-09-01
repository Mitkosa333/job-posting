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
    
    // Add every candidate to this job with varying percentage scores
    candidates.forEach(candidate => {
      let percentage;
      
      // Generate percentage with realistic distribution:
      // 70% of candidates score below 50%
      // 30% of candidates score 50% or above
      const randomValue = Math.random();
      
      if (randomValue < 0.7) {
        // 70% chance: Score between 15-49%
        percentage = Math.floor(Math.random() * 35) + 15;
      } else {
        // 30% chance: Score between 50-95%
        percentage = Math.floor(Math.random() * 46) + 50;
      }
      
      jobCandidates.push({
        candidateId: candidate._id,
        percentage: percentage
      });
    });
    
    // Update the job with all candidates and mark as AI processed
    db.jobs.updateOne(
      { _id: job._id },
      { $set: { candidates: jobCandidates, aiProcessed: true } }
    );
    
    print(`✅ Added ${jobCandidates.length} candidates to job: "${job.title}"`);
  });
  
  // Mark all candidates as AI processed since they've been linked to jobs
  db.candidates.updateMany(
    {},
    { $set: { aiProcessed: true } }
  );
  
  print(`\n✅ Marked all ${candidates.length} candidates as AI processed`);
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
