import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Candidate from '@/models/Candidate'

export async function GET() {
  try {
    await dbConnect()
    const candidates = await Candidate.find({})
      .sort({ submittedAt: -1 })
      .lean()

    return NextResponse.json(candidates)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 })
  }
}
