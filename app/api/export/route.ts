import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const type = req.nextUrl.searchParams.get('type') || 'students'

    let csv = ''
    let filename = ''

    if (type === 'students') {
      const students = await db.student.findMany({ where: { hostelId: hostel.id }, include: { bed: { include: { room: true } } } })
      csv = 'Name,Phone,Email,Room,Food,Rent,Join Date\n'
      csv += students.map(s => `"${s.name}","${s.phone}","${s.email || ''}","${s.bed?.room?.number || ''}","${s.foodPreference}","${s.monthlyRent}","${s.joinDate.toLocaleDateString()}"`).join('\n')
      filename = 'students.csv'
    } else if (type === 'payments') {
      const payments = await db.payment.findMany({ where: { student: { hostelId: hostel.id } }, include: { student: true } })
      csv = 'Student,Phone,Amount,Month,Method,Status,Date\n'
      csv += payments.map(p => `"${p.student.name}","${p.student.phone}","${p.amount}","${p.month}","${p.method}","${p.status}","${p.paymentDate.toLocaleDateString()}"`).join('\n')
      filename = 'payments.csv'
    } else if (type === 'expenses') {
      const expenses = await db.expense.findMany({ where: { hostelId: hostel.id } })
      csv = 'Category,Description,Amount,Date\n'
      csv += expenses.map(e => `"${e.category}","${e.description}","${e.amount}","${e.date.toLocaleDateString()}"`).join('\n')
      filename = 'expenses.csv'
    }

    return new NextResponse(csv, {
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="${filename}"` },
    })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
