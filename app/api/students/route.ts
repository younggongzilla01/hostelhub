import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })

    const search = req.nextUrl.searchParams.get('search') || ''
    const students = await db.student.findMany({
      where: {
        hostelId: hostel.id,
        ...(search ? { OR: [{ name: { contains: search } }, { phone: { contains: search } }] } : {}),
      },
      include: {
        bed: { include: { room: { include: { floor: true } } } },
        payments: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(students)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })

    const { name, phone, email, address, aadharNumber, foodPreference, bedId, monthlyRent, dueDate, joinDate, initialPayment } = await req.json()
    if (!name || !phone || !monthlyRent) return NextResponse.json({ error: 'Name, phone, and monthly rent are required' }, { status: 400 })

    const student = await db.student.create({
      data: {
        hostelId: hostel.id, name, phone, email, address, aadharNumber,
        foodPreference: foodPreference || 'veg',
        monthlyRent: parseFloat(monthlyRent),
        dueDate: parseInt(dueDate) || 5,
        joinDate: joinDate ? new Date(joinDate) : new Date(),
        ...(bedId ? { bedId } : {}),
      },
    })

    if (bedId) await db.bed.update({ where: { id: bedId }, data: { isOccupied: true } })

    if (initialPayment?.amount) {
      await db.payment.create({
        data: {
          studentId: student.id,
          amount: parseFloat(initialPayment.amount),
          month: initialPayment.month,
          method: initialPayment.method || 'cash',
          status: 'paid',
          paymentDate: new Date(),
        },
      })
    }

    return NextResponse.json(student, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 })
  }
}
