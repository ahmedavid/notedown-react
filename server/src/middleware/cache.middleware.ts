import { NextFunction, Request, Response } from "express"
import { createClient } from "redis"

const redisClient = createClient({
  url: "redis://141.144.253.157:6379",
})

redisClient.on("error", (err) => console.log("Redis Client Error", err))

export async function cacheMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const noteId = parseInt(req.params.noteId)
  const cachedNote = await redisClient.get(`note-${noteId}`)
  if (cachedNote) return res.json({ error: null, data: cachedNote })
  console.log(`Cache miss note-${noteId}`)
  next()
}
