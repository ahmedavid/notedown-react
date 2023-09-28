import express, { CookieOptions } from "express"
const router = express.Router()
import { prisma } from "../db"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as jose from "jose"

router.post("/register", async (req, res) => {
  console.log("BODY: ", req.body)
  try {
    const { name, email, password, passwordConfirm } = req.body

    const validationSchema = [
      {
        valid: validator.isLength(name, { min: 1, max: 20 }),
        errorMessage: "Name is invalid",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isLength(password, { min: 5, max: 100 }),
        errorMessage: "Password is invalid",
      },
      {
        valid: validator.equals(password, passwordConfirm),
        errorMessage: "Passwords doesnt match",
      },
    ]

    const errors: string[] = []

    validationSchema.forEach((check) => {
      if (!check.valid) errors.push(check.errorMessage)
    })

    if (errors.length > 0) {
      return res.status(400).json({ errorMessage: errors[0] })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (user)
      return res.status(400).json({ error: "Email is already registered" })

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    })

    const token = await new jose.SignJWT({ id: newUser.id, email, name })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("secret"))

    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    })
    res.status(201).json({ error: null, data: newUser })
  } catch (error) {
    console.log("REGISTER ERROR", error)
    return res.status(500).json({ error })
  }
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: "Email and Password required" })
  const validationSchema = [
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isLength(password, {
        min: 1,
      }),
      errorMessage: "Password is invalid",
    },
  ]

  const errors: string[] = []
  validationSchema.forEach((check) => {
    if (!check.valid) errors.push(check.errorMessage)
  })

  if (errors.length) {
    return res.status(400).json({ error: errors[0] })
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" })

  const token = await new jose.SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode("secret"))

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "none",
    secure: true,
  })
  res.status(201).json({ error: null, data: user })
})

export default router
