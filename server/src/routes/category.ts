import express, { Request, Response } from "express"
const router = express.Router()
import { prisma } from "../db"
import { UserRequest } from "../middleware/auth"

// router.get("/:userId", async (req: Request, res: Response) => {
//   const userId = req.params.userId
//   console.log("USER ID:", userId)
//   const categories = await prisma.category.findMany()
//   res.json(categories)
// })

router.get("/", async (req: Request, res: Response) => {
  const userId = (req as UserRequest).user.id
  console.log("USER ID FROM TOKEN:", userId)
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: [{ id: "asc" }],
    include: {
      notes: { orderBy: [{ id: "asc" }], select: { id: true, title: true } },
    },
  })
  res.json(categories)
})

router.post(`/`, async (req: Request, res: Response) => {
  try {
    const userId = (req as UserRequest).user.id
    if (!userId) return res.json({ error: "Invalid userId", data: null })
    const result = await prisma.category.create({
      data: { userId, ...req.body },
    })

    res.json({
      error: null,
      data: result,
    })
  } catch (error) {
    res.json({
      error: error,
      data: null,
    })
  }
})

router.delete(`/`, async (req: Request, res: Response) => {
  try {
    const userId = (req as UserRequest).user.id
    if (!userId) return res.json({ error: "Invalid userId", data: null })
    const categoryId = req.body.categoryId
    if (!categoryId)
      return res.json({ error: "Invalid categoryId", data: null })
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { notes: true },
    })
    if (category && category.notes.length > 0) {
      return res
        .status(400)
        .json({ error: "Bad request, cannot delete non empty category" })
    }
    await prisma.category.delete({
      where: { id: categoryId },
    })

    res.json({
      error: null,
      data: "deleted",
    })
  } catch (error) {
    res.json({
      error: error,
      data: null,
    })
  }
})

export default router
