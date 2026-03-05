import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()
    const student = await db.student.findUnique({
      where: { id: params.id },
      include: { bed: { include: { room: { include: { floor: true } } } }, payments: { orderBy: { paymentDate: 'desc' } } },
    })
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(student)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()
    const student = await db.student.findUnique({
      where: { id: params.id },
      include: { bed: { include: { room: true } }, payments: true, hostel: true },
    })
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const totalPaid = student.payments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0)

    // Archive to OldStudent
    await db.oldStudent.create({
      data: {
        hostelId: student.hostelId,
        name: student.name, phone: student.phone, email: student.email,
        address: student.address, aadharNumber: student.aadharNumber || undefined,
        foodPreference: student.foodPreference,
        roomNumber: student.bed?.room?.number,
        monthlyRent: student.monthlyRent,
        totalPaid,
        joinDate: student.joinDate,
        leaveDate: new Date(),
      },
    })

    // Free bed
    if (student.bedId) await db.bed.update({ where: { id: student.bedId }, data: { isOccupied: false } })

    await db.student.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to remove student' }, { status: 500 })
  }
}
