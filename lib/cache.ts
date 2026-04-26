import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache TTL in seconds
const TTL = {
  states: 86400,      // 24 hours — states never change
  districts: 86400,   // 24 hours
  subdistricts: 3600, // 1 hour
  villages: 3600,     // 1 hour
  search: 300,        // 5 minutes
}

export async function getCached(key: string): Promise<any> {
  try {
    const data = await redis.get(key)
    return data
  } catch {
    return null
  }
}

export async function setCached(key: string, data: any, type: keyof typeof TTL): Promise<void> {
  try {
    await redis.setex(key, TTL[type], JSON.stringify(data))
  } catch {
    // silently fail — cache is optional
  }
}