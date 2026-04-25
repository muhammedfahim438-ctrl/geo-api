import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import jwt from 'jsonwebtoken'
import { generateApiKey } from '@/lib/auth'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

function getUserFromToken(request: Request) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
  } catch {
    return null
  }
}

// GET - list all keys for user
export async function GET(request: Request) {
  const user = getUserFromToken(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const result = await pool.query(
    'SELECT id, key_value, name, is_active, requests_today, requests_total, created_at FROM api_keys WHERE user_id = $1',
    [user.userId]
  )

  return NextResponse.json({ success: true, data: result.rows })
}

// POST - create new key
export async function POST(request: Request) {
  const user = getUserFromToken(request)
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { name } = await request.json()
  const apiKey = generateApiKey()

  const result = await pool.query(
    'INSERT INTO api_keys (user_id, key_value, name) VALUES ($1, $2, $3) RETURNING *',
    [user.userId, apiKey, name || 'New Key']
  )

  return NextResponse.json({ success: true, data: result.rows[0] })
}