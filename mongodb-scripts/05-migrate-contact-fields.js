// MongoDB script to migrate existing candidates with new contact tracking fields
// Run this to add contact fields to existing candidate records
// Run this in MongoDB shell or MongoDB Compass

// Switch to job-board database
use('job-board');

print("🔄 Starting contact fields migration...");

// Update all existing candidates that don't have contact fields
const migrationResult = db.candidates.updateMany(
  {
    // Only update candidates that don't have the contacted field
    contacted: { $exists: false }
  },
  {
    $set: {
      contacted: false,
      // Don't set contactedAt or contactNotes for non-contacted candidates
      updatedAt: new Date()
    }
  }
);

print(`📊 Migration Results:`);
print(`   - Documents matched: ${migrationResult.matchedCount}`);
print(`   - Documents modified: ${migrationResult.modifiedCount}`);

// Verify the migration
const totalCandidates = db.candidates.countDocuments();
const candidatesWithContactField = db.candidates.countDocuments({ contacted: { $exists: true } });

print(`\n📋 Verification:`);
print(`   - Total candidates: ${totalCandidates}`);
print(`   - Candidates with contact field: ${candidatesWithContactField}`);

if (totalCandidates === candidatesWithContactField) {
  print("✅ Migration completed successfully!");
  print("   All candidates now have contact tracking fields");
} else {
  print("⚠️  Migration incomplete!");
  print("   Some candidates may be missing contact fields");
}

// Add indexes for new fields if they don't exist
print("\n🔍 Creating indexes for contact fields...");

try {
  db.candidates.createIndex({ "contacted": 1 });
  print("✅ Index created for 'contacted' field");
} catch (e) {
  if (e.code === 85) {
    print("ℹ️  Index for 'contacted' field already exists");
  } else {
    print("❌ Error creating 'contacted' index:", e.message);
  }
}

try {
  db.candidates.createIndex({ "contactedAt": -1 });
  print("✅ Index created for 'contactedAt' field");
} catch (e) {
  if (e.code === 85) {
    print("ℹ️  Index for 'contactedAt' field already exists");
  } else {
    print("❌ Error creating 'contactedAt' index:", e.message);
  }
}

// Sample query to show contacted vs non-contacted candidates
const contactedCount = db.candidates.countDocuments({ contacted: true });
const notContactedCount = db.candidates.countDocuments({ contacted: false });

print(`\n📊 Contact Status Summary:`);
print(`   - Contacted candidates: ${contactedCount}`);
print(`   - Not contacted candidates: ${notContactedCount}`);

print("\n🎉 Contact fields migration completed!");
print("\nNext steps:");
print("- Existing candidates now have contacted: false by default");
print("- Use the application UI to mark candidates as contacted");
print("- Contact notes and timestamps will be added when candidates are contacted");
