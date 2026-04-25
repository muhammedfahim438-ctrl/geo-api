import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  // Security check - only Vercel cron can call this
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await pool.query('UPDATE api_keys SET requests_today = 0')
    return NextResponse.json({ 
      success: true, 
      message: 'Daily limits reset successfully',
      time: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Reset failed' }, { status: 500 })
  }
}