import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('job-board')
    const jobs = await db.collection('jobs').find({}).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const job = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const client = await clientPromise
    const db = client.db('job-board')
    const result = await db.collection('jobs').insertOne(job)
    
    return NextResponse.json({ 
      message: 'Job created successfully', 
      jobId: result.insertedId 
    }, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
