import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Job from '@/models/Job'
import Candidate from '@/models/Candidate'
import { calculateAllCandidateMatches } from '@/lib/openai'
import { Types } from 'mongoose'

// GET single job
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

    const job = await Job.findById(params.id).populate('candidates.candidateId')

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// PUT update job
export async function PUT(
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

    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Update the job and reset AI processing
    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        aiProcessed: false,
        candidates: [] // Clear existing matches
      },
      { new: true }
    )

    if (!updatedJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Start AI matching in background
    processJobAIMatchingAsync(updatedJob._id.toString())

    return NextResponse.json({
      message: 'Job updated successfully',
      job: updatedJob
    })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE job
export async function DELETE(
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

    // Delete the job
    await Job.findByIdAndDelete(params.id)

    console.log(`Job deleted: ${params.id} - ${job.title}`)

    return NextResponse.json({
      message: 'Job deleted successfully',
      deletedJob: {
        id: job._id,
        title: job.title
      }
    })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}

// Background function to process AI matching for updated job
async function processJobAIMatchingAsync(jobId: string) {
  let job;
  
  try {
    await dbConnect()

    job = await Job.findById(jobId)
    if (!job) {
      console.error('Job not found for AI processing:', jobId)
      return
    }

    const candidates = await Candidate.find({})
    console.log(`Processing AI matching for updated job: ${job.title} against ${candidates.length} candidates`)

    let candidatesArray: { candidateId: Types.ObjectId; percentage: number }[] = []
    let resultMessage = 'Job marked as AI processed (no candidates to match)'

    if (candidates.length > 0) {
      // Calculate match percentages using OpenAI
      const candidateMatches = await calculateAllCandidateMatches(
        job.description,
        candidates.map((candidate: any) => ({
          _id: candidate._id.toString(),
          resume: candidate.resume
        }))
      )

      console.log(`Calculated ${candidateMatches.length} candidate matches out of ${candidates.length} total candidates`)

      if (candidateMatches.length > 0) {
        candidatesArray = candidateMatches.map(match => ({
          candidateId: new Types.ObjectId(match.candidateId),
          percentage: match.percentage
        }))
        resultMessage = `Successfully updated job with ${candidateMatches.length} candidate matches and marked as AI processed`
      } else {
        resultMessage = 'Job marked as AI processed (no candidate matches found)'
      }
    }

    // Update job with results (always mark as processed)
    await markJobAsProcessed(job, candidatesArray)
    console.log(resultMessage)

  } catch (error) {
    console.error('Error in background AI matching for updated job:', error)
    
    // Mark as processed even on error to prevent infinite loops
    if (job) {
      await markJobAsProcessed(job, [])
    } else {
      try {
        await Job.findByIdAndUpdate(jobId, { aiProcessed: true, candidates: [] })
      } catch (updateError) {
        console.error('Error updating job aiProcessed flag:', updateError)
      }
    }
  }
}

// Helper function to mark job as processed and save
async function markJobAsProcessed(job: any, candidatesArray: { candidateId: Types.ObjectId; percentage: number }[]) {
  job.candidates = candidatesArray
  job.aiProcessed = true
  await job.save()
}
