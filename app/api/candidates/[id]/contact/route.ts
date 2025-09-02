import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Candidate from '@/models/Candidate'
import { Types } from 'mongoose'

export const dynamic = 'force-dynamic'

// Mark candidate as contacted
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid candidate ID' },
        { status: 400 }
      )
    }

    const { notes } = await request.json()

    const candidate = await Candidate.findByIdAndUpdate(
      params.id,
      {
        contacted: true,
        contactedAt: new Date(),
        contactNotes: notes || ''
      },
      { new: true }
    )

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Candidate marked as contacted',
      candidate: {
        id: candidate._id,
        contacted: candidate.contacted,
        contactedAt: candidate.contactedAt,
        contactNotes: candidate.contactNotes
      }
    })
  } catch (error) {
    console.error('Error marking candidate as contacted:', error)
    return NextResponse.json(
      { error: 'Failed to mark candidate as contacted' },
      { status: 500 }
    )
  }
}

// Unmark candidate as contacted
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid candidate ID' },
        { status: 400 }
      )
    }

    const candidate = await Candidate.findByIdAndUpdate(
      params.id,
      {
        contacted: false,
        contactedAt: null,
        contactNotes: ''
      },
      { new: true }
    )

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Candidate contact status removed',
      candidate: {
        id: candidate._id,
        contacted: candidate.contacted
      }
    })
  } catch (error) {
    console.error('Error removing candidate contact status:', error)
    return NextResponse.json(
      { error: 'Failed to remove contact status' },
      { status: 500 }
    )
  }
}
