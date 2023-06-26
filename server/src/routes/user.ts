import express from "express"
const router = express.Router()
import { prisma } from "../db"

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

router.post(`/`, async (req, res) => {
  try {
    const result = await prisma.user.create({
      data: { ...req.body },
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
