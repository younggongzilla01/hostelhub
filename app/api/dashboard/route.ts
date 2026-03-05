import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET() {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })

    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const [students, beds, oldStudents, currentMonthPayments, pendingPayments, dueSoon] = await Promise.all([
      db.student.findMany({ where: { hostelId: hostel.id }, select: { foodPreference: true } }),
      db.bed.findMany({ where: { room: { floor: { hostelId: hostel.id } } }, select: { isOccupied: true } }),
      db.oldStudent.count({ where: { hostelId: hostel.id } }),
      db.payment.aggregate({ where: { student: { hostelId: hostel.id }, paymentDate: { gte: monthStart, lte: monthEnd }, status: 'paid' }, _sum: { amount: true } }),
      db.payment.aggregate({ where: { student: { hostelId: hostel.id }, status: 'pending' }, _sum: { amount: true } }),
      db.student.findMany({
        where: { hostelId: hostel.id, dueDate: { lte: now.getDate() + 5 } },
        take: 10,
        include: { bed: { include: { room: { include: { floor: true } } } } },
        orderBy: { dueDate: 'asc' },
      }),
    ])

    const totalBeds = beds.length
    const occupiedBeds = beds.filter(b => b.isOccupied).length
    const availableBeds = totalBeds - occupiedBeds

    return NextResponse.json({
      stats: {
        totalStudents: students.length,
        totalRooms: hostel.totalRooms,
        totalBeds,
        availableBeds,
        occupiedBeds,
        occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
        vegStudents: students.filter(s => s.foodPreference === 'veg').length,
        nonVegStudents: students.filter(s => s.foodPreference === 'non-veg').length,
        oldStudentsCount: oldStudents,
      },
      revenue: {
        currentMonth: currentMonthPayments._sum.amount || 0,
        pending: pendingPayments._sum.amount || 0,
      },
      dueSoonStudents: dueSoon,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
