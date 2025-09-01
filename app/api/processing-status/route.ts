import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('candidateId')

    if (!candidateId) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('job-board')

    // Check if the candidate has been AI processed
    const candidate = await db.collection('candidates').findOne({
      _id: new ObjectId(candidateId)
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    const isProcessed = candidate.aiProcessed || false

    let matchCount = 0
    if (isProcessed) {
      // If processed, count how many jobs the candidate matched with
      const jobsWithCandidate = await db.collection('jobs').find({
        'candidates.candidateId': new ObjectId(candidateId)
      }).toArray()
      matchCount = jobsWithCandidate.length
    }

    return NextResponse.json({
      candidateId,
      isProcessed,
      matchCount,
      message: isProcessed 
        ? `Processing complete! Found ${matchCount} job matches.`
        : 'Still processing your application...'
    })

  } catch (error) {
    console.error('Error checking processing status:', error)
    return NextResponse.json(
      { error: 'Failed to check processing status' },
      { status: 500 }
    )
  }
}
