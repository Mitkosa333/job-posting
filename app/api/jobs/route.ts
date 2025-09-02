import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Job from '@/models/Job'
import Candidate from '@/models/Candidate'
import { calculateAllCandidateMatches } from '@/lib/openai'
import { Types } from 'mongoose'

// Async function to process AI matching for new jobs in the background
async function processJobAIMatchingAsync(jobId: Types.ObjectId, jobDescription: string) {
  try {
    await dbConnect()
    console.log(`Starting background AI processing for job: ${jobId}`)
    
    // Get all existing candidates
    const candidates = await Candidate.find({})
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
          candidateId: new Types.ObjectId(match.candidateId),
          percentage: match.percentage
        }))

        await Job.findByIdAndUpdate(
          jobId,
          { 
            candidates: candidatesArray,
            aiProcessed: true
          }
        )

        console.log(`Successfully updated job with ${candidateMatches.length} candidate matches and marked as AI processed`)
      }
    } else {
      // No candidates to match, but still mark as processed
      await Job.findByIdAndUpdate(
        jobId,
        { aiProcessed: true }
      )
      console.log(`Job marked as AI processed (no candidates to match)`)
    }
  } catch (error) {
    console.error('AI matching failed in background for job:', error)
    // Log the error but don't throw - we don't want to crash the background process
  }
}

export async function GET() {
  try {
    await dbConnect()
    const jobs = await Job.find({})
      .sort({ createdAt: -1 })
      .populate('candidates.candidateId', 'firstName lastName email')
      .lean()

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { title, description } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const newJob = new Job({
      title,
      description,
      candidates: [],
      aiProcessed: false,
    })

    const savedJob = await newJob.save()

    console.log(`New job created: ${savedJob._id}`)

    // Start AI processing asynchronously (don't await)
    processJobAIMatchingAsync(savedJob._id, description).catch(error => {
      console.error('Background AI processing failed for job:', error)
    })

    return NextResponse.json({
      message: 'Job posted successfully! AI matching is processing in the background.',
      jobId: savedJob._id,
      job: savedJob.toObject(),
      aiProcessing: true
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}