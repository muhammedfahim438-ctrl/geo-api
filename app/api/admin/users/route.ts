import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const DAILY_LIMITS: Record<string, number> = {
  free: 5000,
  premium: 50000,
  pro: 300000,
  unlimited: 1000000
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const user = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
    if (!user.isAdmin) return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 })

    const usersResult = await pool.query(`
      SELECT 
        u.id, u.email, u.company_name, u.plan, u.created_at, u.is_active,
        COALESCE(SUM(k.requests_total), 0) as total_requests,
        COALESCE(MAX(k.requests_today), 0) as requests_today
      FROM api_users u
      LEFT JOIN api_keys k ON u.id = k.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)

    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COALESCE(SUM(k.requests_total), 0) as total_requests,
        COALESCE(SUM(k.requests_today), 0) as today_requests
      FROM api_users u
      LEFT JOIN api_keys k ON u.id = k.user_id
    `)

    // Add usage percentage and warning level to each user
    const usersWithWarnings = usersResult.rows.map(u => {
      const dailyLimit = DAILY_LIMITS[u.plan] || 5000
      const usagePercent = Math.round((u.requests_today / dailyLimit) * 100)
      let warningLevel = null
      if (usagePercent >= 95) warningLevel = 95
      else if (usagePercent >= 80) warningLevel = 80

      return {
        ...u,
        daily_limit: dailyLimit,
        usage_percent: usagePercent,
        warning_level: warningLevel
      }
    })

    return NextResponse.json({
      success: true,
      data: usersWithWarnings,
      stats: statsResult.rows[0]
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
}