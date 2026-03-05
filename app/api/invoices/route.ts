import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const invoices = await db.invoice.findMany({ where: { hostelId: hostel.id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(invoices)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const { studentId, studentName, roomNumber, amount, month, dueDate } = await req.json()
    const invoice = await db.invoice.create({
      data: { hostelId: hostel.id, studentId, studentName, roomNumber, amount: parseFloat(amount), month, dueDate: dueDate ? new Date(dueDate) : null },
    })
    return NextResponse.json(invoice, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
