import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('job-board')
    const candidates = await db.collection('candidates').find({}).toArray()

    const formattedCandidates = candidates.map(candidate => ({
      _id: candidate._id.toString(),
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      resume: candidate.resume,
      submittedAt: candidate.submittedAt,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    }))

    return NextResponse.json(formattedCandidates)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 })
  }
}
