import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  
  try {
    const user = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
    if (!user.isAdmin) return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 })

    const usersResult = await pool.query(`
      SELECT u.id, u.email, u.company_name, u.plan, u.created_at,
             COALESCE(SUM(k.requests_total), 0) as total_requests
      FROM api_users u
      LEFT JOIN api_keys k ON u.id = k.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)

    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COALESCE(SUM(k.requests_total), 0) as total_requests
      FROM api_users u
      LEFT JOIN api_keys k ON u.id = k.user_id
    `)

    return NextResponse.json({
      success: true,
      data: usersResult.rows,
      stats: statsResult.rows[0]
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
}