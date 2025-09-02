import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Candidate from '@/models/Candidate'
import Job from '@/models/Job'
import { Types } from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get('candidateId')

    if (!candidateId) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 })
    }

    if (!Types.ObjectId.isValid(candidateId)) {
      return NextResponse.json({ error: 'Invalid candidate ID' }, { status: 400 })
    }

    await dbConnect()

    // Check if the candidate has been AI processed
    const candidate = await Candidate.findById(candidateId)

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    const isProcessed = candidate.aiProcessed || false

    let matchCount = 0
    if (isProcessed) {
      // If processed, count how many jobs the candidate matched with
      const jobsWithCandidate = await Job.find({
        'candidates.candidateId': new Types.ObjectId(candidateId)
      })
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
