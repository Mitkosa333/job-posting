// MongoDB script to clean up and verify data integrity
// Run this AFTER all other scripts (optional)
// Run this in MongoDB shell or MongoDB Compass

// Switch to job-board database
use('job-board');

print("🧹 Starting data cleanup and verification...\n");

// 1. Remove any duplicate candidates by email
print("1. Checking for duplicate candidates...");
const duplicates = db.candidates.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 }, docs: { $push: "$_id" } } },
  { $match: { count: { $gt: 1 } } }
]).toArray();

if (duplicates.length > 0) {
  print(`Found ${duplicates.length} duplicate email(s):`);
  duplicates.forEach(dup => {
    print(`• ${dup._id} (${dup.count} occurrences)`);
    // Keep first document, remove others
    dup.docs.slice(1).forEach(id => {
      db.candidates.deleteOne({ _id: id });
    });
  });
  print("✅ Duplicates removed");
} else {
  print("✅ No duplicate candidates found");
}

// 2. Verify all candidate references in jobs exist
print("\n2. Verifying candidate references...");
const jobs = db.jobs.find({ "candidates.0": { $exists: true } }).toArray();
let invalidRefs = 0;

jobs.forEach(job => {
  const validCandidates = [];
  
  job.candidates.forEach(candidate => {
    const candidateExists = db.candidates.findOne({ _id: candidate.candidateId });
    if (candidateExists) {
      validCandidates.push(candidate);
    } else {
      invalidRefs++;
      print(`⚠️  Invalid candidate reference in job "${job.title}"`);
    }
  });
  
  // Update job with only valid candidates
  if (validCandidates.length !== job.candidates.length) {
    db.jobs.updateOne(
      { _id: job._id },
      { $set: { candidates: validCandidates } }
    );
  }
});

if (invalidRefs === 0) {
  print("✅ All candidate references are valid");
} else {
  print(`✅ Cleaned up ${invalidRefs} invalid references`);
}

// 3. Add missing timestamps
print("\n3. Adding missing timestamps...");
const now = new Date();

// Update jobs without createdAt
const jobsUpdated = db.jobs.updateMany(
  { createdAt: { $exists: false } },
  { $set: { createdAt: now, updatedAt: now } }
);

// Update candidates without createdAt
const candidatesUpdated = db.candidates.updateMany(
  { createdAt: { $exists: false } },
  { $set: { createdAt: now, updatedAt: now } }
);

print(`✅ Updated ${jobsUpdated.modifiedCount} jobs and ${candidatesUpdated.modifiedCount} candidates with timestamps`);

// 4. Validate percentage ranges
print("\n4. Validating percentage ranges...");
const invalidPercentages = db.jobs.updateMany(
  { "candidates.percentage": { $lt: 0 } },
  { $set: { "candidates.$.percentage": 0 } }
);

const highPercentages = db.jobs.updateMany(
  { "candidates.percentage": { $gt: 100 } },
  { $set: { "candidates.$.percentage": 100 } }
);

print(`✅ Fixed ${invalidPercentages.modifiedCount + highPercentages.modifiedCount} invalid percentages`);

// 5. Generate final statistics
print("\n📊 Final Database Statistics:");
print("============================");

const totalJobs = db.jobs.countDocuments();
const totalCandidates = db.candidates.countDocuments();
const totalApplications = db.jobs.aggregate([
  { $unwind: { path: "$candidates", preserveNullAndEmptyArrays: true } },
  { $group: { _id: null, total: { $sum: { $cond: [{ $ifNull: ["$candidates", false] }, 1, 0] } } } }
]).toArray()[0]?.total || 0;

print(`📝 Total Jobs: ${totalJobs}`);
print(`👥 Total Candidates: ${totalCandidates}`);
print(`📋 Total Applications: ${totalApplications}`);

// Average applications per job
const avgApplications = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0;
print(`📈 Average Applications per Job: ${avgApplications}`);

// Jobs without applications
const jobsWithoutApps = db.jobs.countDocuments({ candidates: { $size: 0 } });
print(`📭 Jobs without Applications: ${jobsWithoutApps}`);

// Most popular job
const mostPopular = db.jobs.aggregate([
  { $addFields: { appCount: { $size: { $ifNull: ["$candidates", []] } } } },
  { $sort: { appCount: -1 } },
  { $limit: 1 }
]).toArray()[0];

if (mostPopular) {
  print(`🏆 Most Popular Job: "${mostPopular.title}" (${mostPopular.appCount} applications)`);
}

print("\n🎉 Data cleanup and verification completed!");
print("💾 Database is ready for use!");

// Optional: Create a backup timestamp
db.metadata.insertOne({
  type: "backup_info",
  created: new Date(),
  stats: {
    jobs: totalJobs,
    candidates: totalCandidates,
    applications: totalApplications
  }
});
