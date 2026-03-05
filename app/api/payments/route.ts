import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const status = req.nextUrl.searchParams.get('status')
    const payments = await db.payment.findMany({
      where: { student: { hostelId: hostel.id }, ...(status && status !== 'all' ? { status } : {}) },
      include: { student: { include: { bed: { include: { room: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(payments)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    await db.hostel.findUnique({ where: { userId: user.id } })
    const { studentId, amount, paymentDate, month, method, status, notes } = await req.json()
    const payment = await db.payment.create({
      data: { studentId, amount: parseFloat(amount), paymentDate: paymentDate ? new Date(paymentDate) : new Date(), month, method: method || 'cash', status: status || 'paid', notes },
      include: { student: true },
    })
    return NextResponse.json(payment, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
