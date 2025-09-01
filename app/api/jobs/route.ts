import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { calculateAllCandidateMatches } from '@/lib/openai'

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

    // Get all existing candidates
    const candidates = await db.collection('candidates').find({}).toArray()
    console.log(`Found ${candidates.length} candidates for matching`)

    if (candidates.length > 0 && job.description) {
      try {
        // Calculate match percentages using OpenAI
        const candidateMatches = await calculateAllCandidateMatches(
          job.description,
          candidates.map(candidate => ({
            _id: candidate._id.toString(),
            resume: candidate.resume
          }))
        )

        console.log(`Calculated ${candidateMatches.length} candidate matches out of ${candidates.length} total candidates`)

        // Update the job with all candidate matches
        const candidatesWithPercentages = candidateMatches.map(match => ({
          candidateId: match.candidateId,
          percentage: match.percentage
        }))

        await db.collection('jobs').updateOne(
          { _id: jobId },
          {
            $set: {
              candidates: candidatesWithPercentages
            }
          }
        )

        console.log(`Updated job ${jobId} with ${candidateMatches.length} candidate matches`)
      } catch (error) {
        console.error('OpenAI matching failed:', error)
        // Continue without matching - job is still created
        console.log('Job created without AI matching due to OpenAI error')
      }
    }

    return NextResponse.json({
      message: 'Job created successfully',
      jobId: jobId,
      candidateMatches: candidates.length
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
