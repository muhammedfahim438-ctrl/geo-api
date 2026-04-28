import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const user = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
    if (!user.isAdmin) return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 })

    const { userId, plan } = await request.json()
    await pool.query('UPDATE api_users SET plan = $1 WHERE id = $2', [plan, userId])

    return NextResponse.json({ success: true, message: `Plan updated to ${plan}` })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update plan' }, { status: 500 })
  }
}