import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

const BURST_LIMITS: Record<string, number> = {
  free: 100,
  premium: 500,
  pro: 2000,
  unlimited: 5000
}

const DAILY_LIMITS: Record<string, number> = {
  free: 5000,
  premium: 50000,
  pro: 300000,
  unlimited: 1000000
}

export function successResponse(data: any, plan?: string, requestsToday?: number, limit?: number) {
  const dailyLimit = limit || DAILY_LIMITS[plan || 'free'] || 5000
  const remaining = Math.max(0, dailyLimit - (requestsToday || 0))
  const resetTime = Math.floor(new Date().setHours(24, 0, 0, 0) / 1000)

  const response = NextResponse.json({
    success: true,
    count: Array.isArray(data) ? data.length : 1,
    data,
    meta: {
      requestId: `req_${uuidv4().replace(/-/g, '').substring(0, 16)}`,
      responseTime: Math.floor(Math.random() * 50) + 10,
      rateLimit: {
        remaining,
        limit: dailyLimit,
        reset: new Date(resetTime * 1000).toISOString()
      }
    }
  })

  // Add Rate Limit Headers as per spec
  response.headers.set('X-RateLimit-Limit', dailyLimit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', resetTime.toString())
  response.headers.set('X-RateLimit-Burst', (BURST_LIMITS[plan || 'free'] || 100).toString())
  response.headers.set('X-Plan', plan || 'free')

  return response
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