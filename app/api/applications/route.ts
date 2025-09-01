import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { calculateAllJobMatches } from '@/lib/openai'
import { ObjectId } from 'mongodb'

// Async function to process AI matching in the background
async function processAIMatchingAsync(candidateId: ObjectId, resume: string, db: any) {
  try {
    console.log(`Starting background AI processing for candidate: ${candidateId}`)
    
    // Get all active jobs
    const jobs = await db.collection('jobs').find({}).toArray()
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
        await db.collection('jobs').updateOne(
          { _id: new ObjectId(match.jobId) },
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
    }
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
    }

    const client = await clientPromise
    const db = client.db('job-board')

    // Insert the candidate first
    const candidateResult = await db.collection('candidates').insertOne(candidateData)
    const candidateId = candidateResult.insertedId

    console.log(`New candidate created: ${candidateId}`)

    // Redirect to processing page immediately with candidate ID
    const processingUrl = new URL('/', request.url)
    processingUrl.searchParams.set('processing', 'true')
    processingUrl.searchParams.set('candidateId', candidateId.toString())

    // Start AI processing asynchronously (don't await)
    processAIMatchingAsync(candidateId, candidateData.resume, db).catch(error => {
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
