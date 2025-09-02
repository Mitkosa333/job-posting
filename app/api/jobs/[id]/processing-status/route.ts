import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Job from '@/models/Job'
import { Types } from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      )
    }

    const job = await Job.findById(params.id)

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      completed: job.aiProcessed,
      candidateCount: job.candidates?.length || 0,
      message: job.aiProcessed 
        ? `AI matching completed! Found ${job.candidates?.length || 0} candidate matches.`
        : 'AI matching in progress...'
    })
  } catch (error) {
    console.error('Error checking job processing status:', error)
    return NextResponse.json(
      { error: 'Failed to check processing status' },
      { status: 500 }
    )
  }
}

