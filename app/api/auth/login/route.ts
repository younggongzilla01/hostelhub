import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, createAuthToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    const user = await db.user.findUnique({ where: { email }, include: { hostel: true } })
    if (!user || user.password !== hashPassword(password)) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const token = createAuthToken(user.id)
    const res = NextResponse.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, hasHostel: !!user.hostel })
    res.cookies.set('auth-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 })
    return res
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
