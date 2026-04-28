import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function successResponse(data: any, plan?: string, requestsToday?: number, limit?: number) {
  const limits: Record<string, number> = {
    free: 5000,
    premium: 50000,
    pro: 300000,
    unlimited: 1000000
  }
  const dailyLimit = limit || limits[plan || 'free'] || 5000
  const remaining = dailyLimit - (requestsToday || 0)

  return NextResponse.json({
    success: true,
    count: Array.isArray(data) ? data.length : 1,
    data,
    meta: {
      requestId: `req_${uuidv4().replace(/-/g, '').substring(0, 16)}`,
      rateLimit: {
        remaining: remaining > 0 ? remaining : 0,
        limit: dailyLimit,
        reset: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
      }
    }
  })
}

export function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({
    success: false,
    error: {
      code,
      message
    }
  }, { status })
}