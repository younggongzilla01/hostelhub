import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const category = req.nextUrl.searchParams.get('category')
    const expenses = await db.expense.findMany({
      where: { hostelId: hostel.id, ...(category && category !== 'all' ? { category } : {}) },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(expenses)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const { category, description, amount, date } = await req.json()
    const expense = await db.expense.create({
      data: { hostelId: hostel.id, category, description, amount: parseFloat(amount), date: date ? new Date(date) : new Date() },
    })
    return NextResponse.json(expense, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
