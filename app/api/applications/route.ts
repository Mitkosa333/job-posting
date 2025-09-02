import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Candidate from '@/models/Candidate'
import Job from '@/models/Job'
import { calculateAllJobMatches } from '@/lib/openai'
import { Types } from 'mongoose'

// Async function to process AI matching in the background
async function processAIMatchingAsync(candidateId: string, resume: string, specificJobId?: string) {
  try {
    await dbConnect()
    console.log(`Starting background AI processing for candidate: ${candidateId}${specificJobId ? ` for job: ${specificJobId}` : ''}`)
    
    // Get jobs to match against - either specific job or all jobs
    const jobs = specificJobId 
      ? await Job.find({ _id: specificJobId })
      : await Job.find({})
    
    console.log(`Found ${jobs.length} job(s) for matching`)

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
                candidateId: new Types.ObjectId(candidateId),
                percentage: match.percentage
              }
            }
          }
        )
      }

      console.log(`Successfully updated ${jobMatches.length} job(s) with candidate matches`)
    } else {
      console.log(`No jobs found to match against candidate ${candidateId}`)
    }

    // Mark the candidate as AI processed regardless of whether there were jobs to match
    await Candidate.findByIdAndUpdate(candidateId, { aiProcessed: true })
    
    console.log(`Candidate ${candidateId} marked as AI processed`)
  } catch (error) {
    console.error('AI matching failed in background:', error)
    // Log the error but don't throw - we don't want to crash the background process
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const formData = await request.formData()

    // Extract form fields
    const candidateData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      resume: formData.get('resume') as string,
      aiProcessed: false
    }

    const jobId = formData.get('jobId') as string

    // Create new candidate
    const newCandidate = new Candidate(candidateData)
    const savedCandidate = await newCandidate.save()

    console.log(`New candidate created: ${savedCandidate._id}${jobId ? ` applying for job: ${jobId}` : ''}`)

    // Start AI processing asynchronously in background (user doesn't need to know)
    processAIMatchingAsync(
      savedCandidate._id.toString(), 
      candidateData.resume, 
      jobId || undefined
    ).catch(error => {
      console.error('Background AI processing failed:', error)
    })

    // Redirect directly to success page
    const successUrl = new URL('/', request.url)
    successUrl.searchParams.set('success', 'true')

    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('Error processing application:', error)

    // Redirect back to the form with error message
    const url = new URL('/', request.url)
    url.searchParams.set('error', 'true')

    return NextResponse.redirect(url)
  }
}
