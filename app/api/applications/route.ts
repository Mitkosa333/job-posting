import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { calculateAllJobMatches } from '@/lib/openai'
import { ObjectId } from 'mongodb'

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

    // Get all active jobs
    const jobs = await db.collection('jobs').find({}).toArray()
    console.log(`Found ${jobs.length} jobs for matching`)

    if (jobs.length > 0) {
      try {
        // Calculate match percentages using OpenAI
        const jobMatches = await calculateAllJobMatches(
          candidateData.resume,
          jobs.map(job => ({
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

        console.log(`Updated ${jobMatches.length} jobs with candidate matches`)
      } catch (error) {
        console.error('OpenAI matching failed:', error)
        // Continue without matching - candidate is still saved
        console.log('Candidate saved without AI matching due to OpenAI error')
      }
    }

    // Redirect back to the form with success message
    const url = new URL('/', request.url)
    url.searchParams.set('success', 'true')

    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Error processing application:', error)

    // Redirect back to the form with error message
    const url = new URL('/', request.url)
    url.searchParams.set('error', 'true')

    return NextResponse.redirect(url)
  }
}
