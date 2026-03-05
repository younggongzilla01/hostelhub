import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const notices = await db.notice.findMany({ where: { hostelId: hostel.id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(notices)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const { title, content, priority, expiryDate } = await req.json()
    const notice = await db.notice.create({
      data: { hostelId: hostel.id, title, content, priority: priority || 'normal', expiryDate: expiryDate ? new Date(expiryDate) : null },
    })
    return NextResponse.json(notice, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
