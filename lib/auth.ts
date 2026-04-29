import pool from './db'

const DAILY_LIMITS: Record<string, number> = {
  free: 5000,
  premium: 50000,
  pro: 300000,
  unlimited: 1000000
}

const BURST_LIMITS: Record<string, number> = {
  free: 100,
  premium: 500,
  pro: 2000,
  unlimited: 5000
}

export async function validateApiKey(apiKey: string) {
  try {
    const result = await pool.query(`
      SELECT 
        ak.id as key_id,
        ak.user_id,
        ak.is_active,
        ak.requests_today,
        ak.requests_total,
        au.plan,
        au.is_active as user_active,
        au.email
      FROM api_keys ak
      JOIN api_users au ON ak.user_id = au.id
      WHERE ak.key_value = $1
    `, [apiKey])

    if (result.rows.length === 0) return null

    const key = result.rows[0]
    if (!key.is_active || !key.user_active) return null

    const dailyLimit = DAILY_LIMITS[key.plan] || 5000

    // Check daily rate limit
    if (key.requests_today >= dailyLimit) {
      return { 
        error: 'rate_limit', 
        plan: key.plan, 
        limit: dailyLimit,
        requestsToday: key.requests_today
      }
    }

    // Check if approaching limit (80% or 95%)
    const usagePercent = (key.requests_today / dailyLimit) * 100
    let warningLevel = null
    if (usagePercent >= 95) warningLevel = 95
    else if (usagePercent >= 80) warningLevel = 80

    // Update usage
    await pool.query(`
      UPDATE api_keys 
      SET requests_today = requests_today + 1,
          requests_total = requests_total + 1,
          last_used = NOW()
      WHERE id = $1
    `, [key.key_id])

    return {
      keyId: key.key_id,
      userId: key.user_id,
      plan: key.plan,
      requestsToday: key.requests_today + 1,
      limit: dailyLimit,
      burstLimit: BURST_LIMITS[key.plan] || 100,
      warningLevel,
      email: key.email
    }
  } catch (error) {
    return null
  }
}

export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'geoapi_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateApiSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'geosecret_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const DAILY_LIMIT_MAP = DAILY_LIMITS