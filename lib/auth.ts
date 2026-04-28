import pool from './db'

// Check API key and return user info
export async function validateApiKey(apiKey: string) {
  try {
    const result = await pool.query(`
      SELECT 
        ak.id as key_id,
        ak.user_id,
        ak.is_active,
        ak.requests_today,
        au.plan,
        au.is_active as user_active
      FROM api_keys ak
      JOIN api_users au ON ak.user_id = au.id
      WHERE ak.key_value = $1
    `, [apiKey])

    if (result.rows.length === 0) return null
    
    const key = result.rows[0]
    if (!key.is_active || !key.user_active) return null

    // Updated rate limits per spec
    const limits: Record<string, number> = {
      free: 5000,
      premium: 50000,
      pro: 300000,
      unlimited: 1000000
    }

    const limit = limits[key.plan] || 5000
    if (key.requests_today >= limit) {
      return { error: 'rate_limit', plan: key.plan, limit }
    }

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
      requestsToday: key.requests_today,
      limit
    }
  } catch (error) {
    return null
  }
}

// Generate random API key
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'geoapi_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Generate API secret
export function generateApiSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'geosecret_'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}