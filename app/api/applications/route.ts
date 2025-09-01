import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const application = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      cvFileName: '',
      submittedAt: new Date(),
    }

    // Handle CV file
    const cvFile = formData.get('cv') as File
    if (cvFile && cvFile.size > 0) {
      application.cvFileName = cvFile.name
      // In a real application, you would save the file to cloud storage
      // For now, we just store the filename
    }
    
    const client = await clientPromise
    const db = client.db('job-board')
    const result = await db.collection('applications').insertOne(application)
    
    // Redirect back to the form with success message
    const url = new URL('/', request.url)
    url.searchParams.set('success', 'true')
    
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Database error:', error)
    
    // Redirect back to the form with error message
    const url = new URL('/', request.url)
    url.searchParams.set('error', 'true')
    
    return NextResponse.redirect(url)
  }
}
