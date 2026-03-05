import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const status = req.nextUrl.searchParams.get('status')
    const complaints = await db.complaint.findMany({
      where: { hostelId: hostel.id, ...(status && status !== 'all' ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(complaints)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const { studentId, studentName, title, description, priority } = await req.json()
    const complaint = await db.complaint.create({
      data: { hostelId: hostel.id, studentId, studentName, title, description, priority: priority || 'normal' },
    })
    return NextResponse.json(complaint, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
