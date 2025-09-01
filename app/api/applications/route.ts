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
      location: formData.get('location') as string,
      position: formData.get('position') as string,
      experience: formData.get('experience') as string,
      skills: formData.get('skills') as string,
      coverLetter: formData.get('coverLetter') as string,
      resumeFileName: '',
      submittedAt: new Date(),
    }

    // Handle resume file
    const resumeFile = formData.get('resume') as File
    if (resumeFile && resumeFile.size > 0) {
      application.resumeFileName = resumeFile.name
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
