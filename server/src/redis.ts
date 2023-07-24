import { RedisClientType, createClient } from "redis"

const globalForRedis = global as unknown as {
  redis: RedisClientType | undefined
}

export const redis =
  globalForRedis.redis ?? createClient({ url: "redis://redis-svc:6379" })

redis.connect()

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis
