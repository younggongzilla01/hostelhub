import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function PUT(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()
    const visitor = await db.visitor.update({ where: { id: params.id }, data: { outTime: new Date() } })
    return NextResponse.json(visitor)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
