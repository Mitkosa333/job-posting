import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Candidate from '@/models/Candidate'
import { Types } from 'mongoose'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect()
    
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid candidate ID' }, { status: 400 })
    }
    
    const candidate = await Candidate.findById(params.id)

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    return NextResponse.json(candidate)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 })
  }
}
