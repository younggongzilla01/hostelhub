import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const availableOnly = req.nextUrl.searchParams.get('available') === 'true'
    const floors = await db.floor.findMany({
      where: { hostelId: hostel.id },
      include: { rooms: { include: { beds: { include: { student: true } } } } },
      orderBy: { number: 'asc' },
    })
    const result = floors.map(f => ({
      ...f,
      rooms: f.rooms
        .filter(r => !availableOnly || r.beds.some(b => !b.isOccupied))
        .map(r => ({
          ...r,
          availableBeds: r.beds.filter(b => !b.isOccupied).length,
          occupiedBeds: r.beds.filter(b => b.isOccupied).length,
        })),
    }))
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({ where: { userId: user.id } })
    if (!hostel) return NextResponse.json({ error: 'No hostel' }, { status: 404 })
    const { floorId, number, sharing } = await req.json()
    const room = await db.room.create({
      data: {
        floorId, number, sharing: parseInt(sharing), totalBeds: parseInt(sharing),
        beds: { create: Array.from({ length: sharing }, (_, i) => ({ number: i + 1 })) },
      },
      include: { beds: true },
    })
    await db.hostel.update({ where: { id: hostel.id }, data: { totalRooms: { increment: 1 }, totalBeds: { increment: sharing } } })
    return NextResponse.json(room, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
