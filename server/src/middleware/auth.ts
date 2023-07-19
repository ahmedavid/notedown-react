import { NextFunction, Request, Response } from "express"
import * as jose from "jose"
import jwt from "jsonwebtoken"

export interface UserRequest extends Request {
  user: {
    id: number
    email: string
    name: string
  }
}

interface TokenData {
  id: number
  email: string
  name: string
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["authorization"])
    return res.status(401).json({ error: "Unauthorized" })

  const token = req.headers["authorization"].split(" ")[1]
  if (!token) return res.status(401).json({ error: "Unauthorized" })

  try {
    const secret = new TextEncoder().encode("secret")
    await jose.jwtVerify(token, secret)
    const { email, name, id }: TokenData = jwt.decode(token) as TokenData
    ;(req as UserRequest).user = { email, id, name }
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  console.log("VALID AUTH:", (req as UserRequest).user)
  next()
}
