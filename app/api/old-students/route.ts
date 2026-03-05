import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const search = req.nextUrl.searchParams.get('search') || ''
    const students = await db.oldStudent.findMany({
      where: { hostelId: hostel.id, ...(search ? { OR: [{ name: { contains: search } }, { phone: { contains: search } }] } : {}) },
      orderBy: { leaveDate: 'desc' },
    })
    return NextResponse.json(students)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
