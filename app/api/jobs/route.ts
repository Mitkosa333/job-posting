import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { calculateAllCandidateMatches } from '@/lib/openai'
import { ObjectId } from 'mongodb'

// Async function to process AI matching for new jobs in the background
async function processJobAIMatchingAsync(jobId: ObjectId, jobDescription: string, db: any) {
  try {
    console.log(`Starting background AI processing for job: ${jobId}`)
    
    // Get all existing candidates
    const candidates = await db.collection('candidates').find({}).toArray()
    console.log(`Found ${candidates.length} candidates for matching`)

    if (candidates.length > 0) {
      // Calculate match percentages using OpenAI
      const candidateMatches = await calculateAllCandidateMatches(
        jobDescription,
        candidates.map((candidate: any) => ({
          _id: candidate._id.toString(),
          resume: candidate.resume
        }))
      )

      console.log(`Calculated ${candidateMatches.length} candidate matches out of ${candidates.length} total candidates`)

      // Update the job with all candidate matches at once
      if (candidateMatches.length > 0) {
        const candidatesArray = candidateMatches.map(match => ({
          candidateId: new ObjectId(match.candidateId),
          percentage: match.percentage
        }))

        await db.collection('jobs').updateOne(
          { _id: jobId },
          { $set: { candidates: candidatesArray } }
        )

        console.log(`Successfully updated job with ${candidateMatches.length} candidate matches`)
      }
    }
  } catch (error) {
    console.error('AI matching failed in background for job:', error)
    // Log the error but don't throw - we don't want to crash the background process
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('job-board')
    const jobs = await db.collection('jobs').find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const job = {
      ...body,
      candidates: [], // Initialize empty candidates array
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const client = await clientPromise
    const db = client.db('job-board')
    
    // Insert the job first
    const result = await db.collection('jobs').insertOne(job)
    const jobId = result.insertedId

    console.log(`New job created: ${jobId}`)

    // Start AI processing asynchronously (don't await)
    if (job.description) {
      processJobAIMatchingAsync(jobId, job.description, db).catch(error => {
        console.error('Background AI processing failed for job:', error)
      })
    }

    return NextResponse.json({
      message: 'Job posted successfully! AI matching is processing in the background.',
      jobId: jobId,
      aiProcessing: true
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
