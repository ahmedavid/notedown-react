import express, { Request, Response } from "express"
const router = express.Router()
import { prisma } from "../db"

// router.get("/:userId", async (req: Request, res: Response) => {
//   const userId = req.params.userId
//   console.log("USER ID:", userId)
//   const categories = await prisma.category.findMany()
//   res.json(categories)
// })

router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId
  console.log("USER ID:", userId)
  const categories = await prisma.category.findMany({
    orderBy: [{ id: "asc" }],
    include: {
      notes: { orderBy: [{ id: "asc" }], select: { id: true, title: true } },
    },
  })
  res.json(categories)
})

router.post(`/:userId`, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId)
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

// Define routes for the User entity
// router.get('/', () => {});
// router.get('/:id', userController.getUserById);
// router.post('/', () => {});
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

export default router
