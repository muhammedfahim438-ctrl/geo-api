import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const TTL = {
  states: 86400,
  districts: 86400,
  subdistricts: 3600,
  villages: 3600,
  search: 300,
}

export async function getCached(key: string): Promise<any> {
  try {
    const data = await redis.get(key)
    return data || null
  } catch {
    return null
  }
}

export async function setCached(key: string, data: any, type: keyof typeof TTL): Promise<void> {
  try {
    await redis.setex(key, TTL[type], data)
  } catch {
    // silently fail
  }
}