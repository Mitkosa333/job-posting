import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const client = await clientPromise
    const db = client.db('job-board')
    
    // Validate ObjectId format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid candidate ID' }, { status: 400 })
    }
    
    const candidate = await db.collection('candidates').findOne({ _id: new ObjectId(params.id) })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    const formattedCandidate = {
      _id: candidate._id.toString(),
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      cvFileName: candidate.cvFileName,
      submittedAt: candidate.submittedAt,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    }

    return NextResponse.json(formattedCandidate)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 })
  }
}
