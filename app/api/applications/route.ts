import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Job from '@/models/Job'
import Candidate from '@/models/Candidate'
import { calculateAllJobMatches } from '@/lib/openai'
import { Types } from 'mongoose'

// Async function to process AI matching in the background
async function processAIMatchingAsync(candidateId: Types.ObjectId, resume: string) {
  try {
    console.log(`Starting background AI processing for candidate: ${candidateId}`)
    
    // Get all active jobs
    const jobs = await Job.find({}).lean()
    console.log(`Found ${jobs.length} jobs for matching`)

    if (jobs.length > 0) {
      // Calculate match percentages using OpenAI
      const jobMatches = await calculateAllJobMatches(
        resume,
        jobs.map((job: any) => ({
          _id: job._id.toString(),
          description: job.description
        }))
      )

      console.log(`Calculated ${jobMatches.length} job matches out of ${jobs.length} total jobs`)

      // Update each job with the new candidate and their percentage
      for (const match of jobMatches) {
        await Job.findByIdAndUpdate(
          match.jobId,
          {
            $push: {
              candidates: {
                candidateId: candidateId,
                percentage: match.percentage
              }
            }
          }
        )
      }

      console.log(`Successfully updated ${jobMatches.length} jobs with candidate matches`)
    } else {
      console.log(`No jobs found to match against candidate ${candidateId}`)
    }

    // Mark the candidate as AI processed regardless of whether there were jobs to match
    await Candidate.findByIdAndUpdate(
      candidateId,
      { aiProcessed: true }
    )
    
    console.log(`Candidate ${candidateId} marked as AI processed`)
  } catch (error) {
    console.error('AI matching failed in background:', error)
    // Log the error but don't throw - we don't want to crash the background process
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const candidateData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      resume: formData.get('resume') as string,
      submittedAt: new Date(),
      aiProcessed: false,
    }

    await dbConnect()

    // Create new candidate using Mongoose model
    const newCandidate = new Candidate(candidateData)
    const savedCandidate = await newCandidate.save()

    console.log(`New candidate created: ${savedCandidate._id}`)

    // Redirect to processing page immediately with candidate ID
    const processingUrl = new URL('/', request.url)
    processingUrl.searchParams.set('processing', 'true')
    processingUrl.searchParams.set('candidateId', savedCandidate._id.toString())

    // Start AI processing asynchronously (don't await)
    processAIMatchingAsync(savedCandidate._id, candidateData.resume).catch(error => {
      console.error('Background AI processing failed:', error)
    })

    return NextResponse.redirect(processingUrl)
  } catch (error) {
    console.error('Error processing application:', error)

    // Redirect back to the form with error message
    const url = new URL('/', request.url)
    url.searchParams.set('error', 'true')

    return NextResponse.redirect(url)
  }
}
