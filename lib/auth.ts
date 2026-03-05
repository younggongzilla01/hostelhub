import crypto from 'crypto'
import { cookies } from 'next/headers'
import { db } from './db'

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function createAuthToken(userId: string): string {
  const data = `${userId}:${Date.now()}`
  return Buffer.from(data).toString('base64')
}

export async function getUserFromToken(token: string) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userId, timestamp] = decoded.split(':')
    if (!userId || !timestamp) return null
    if (Date.now() - parseInt(timestamp) > 7 * 24 * 60 * 60 * 1000) return null
    return await db.user.findUnique({
      where: { id: userId },
      include: { hostel: { include: { facilities: true, sharingPrices: true } } },
    })
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  return getUserFromToken(token)
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}
