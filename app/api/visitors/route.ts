import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const visitors = await db.visitor.findMany({ where: { hostelId: hostel.id }, orderBy: { inTime: 'desc' } })
    return NextResponse.json(visitors)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const { studentId, name, phone, purpose } = await req.json()
    const visitor = await db.visitor.create({ data: { hostelId: hostel.id, studentId, name, phone, purpose } })
    return NextResponse.json(visitor, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
