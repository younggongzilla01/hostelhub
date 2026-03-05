import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const hostel = await db.hostel.findUnique({
      where: { userId: user.id },
      include: { facilities: true, sharingPrices: true, floors: { include: { rooms: { include: { beds: true } } }, orderBy: { number: 'asc' } } },
    })
    if (!hostel) return NextResponse.json({ error: 'Hostel not found' }, { status: 404 })
    return NextResponse.json(hostel)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const { name, address, city, state, pincode, phone, email, description, facilities, sharingPrices, floors } = body
    if (!name) return NextResponse.json({ error: 'Hostel name is required' }, { status: 400 })

    const existing = await db.hostel.findUnique({ where: { userId: user.id } })
    if (existing) return NextResponse.json({ error: 'Hostel already exists' }, { status: 409 })

    // Count totals
    let totalRooms = 0, totalBeds = 0
    for (const floor of floors || []) {
      totalRooms += floor.rooms?.length || 0
      for (const room of floor.rooms || []) totalBeds += room.sharing || 2
    }

    const hostel = await db.hostel.create({
      data: {
        userId: user.id, name, address, city, state, pincode,
        phone, email, description,
        totalFloors: floors?.length || 0, totalRooms, totalBeds,
        facilities: { create: (facilities || []).map((f: string) => ({ name: f })) },
        sharingPrices: { create: (sharingPrices || []).map((sp: { sharing: number; price: number }) => ({ sharing: sp.sharing, price: sp.price })) },
        floors: {
          create: (floors || []).map((floor: { number: number; name: string; rooms: { number: string; sharing: number }[] }) => ({
            number: floor.number, name: floor.name,
            rooms: {
              create: (floor.rooms || []).map((room) => ({
                number: room.number, sharing: room.sharing, totalBeds: room.sharing,
                beds: { create: Array.from({ length: room.sharing }, (_, i) => ({ number: i + 1 })) },
              })),
            },
          })),
        },
      },
      include: { facilities: true, sharingPrices: true, floors: { include: { rooms: { include: { beds: true } } } } },
    })
    return NextResponse.json(hostel)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create hostel' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const hostel = await db.hostel.update({ where: { userId: user.id }, data: body })
    return NextResponse.json(hostel)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
