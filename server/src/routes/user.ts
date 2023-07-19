import express from "express"
const router = express.Router()
import AdmZip from "adm-zip"
import { prisma } from "../db"
import { UserRequest } from "../middleware/auth"

router.get("/export", async (req, res) => {
  const userId = (req as UserRequest).user.id
  const items = await prisma.user.findMany({
    where: { id: userId },
    select: {
      categories: {
        select: {
          title: true,
          notes: { select: { title: true, content: true } },
        },
      },
    },
  })

  const zip = new AdmZip()
  const content = JSON.stringify(items)
  zip.addFile("archive.json", Buffer.from(content, "utf8"))
  res.send(zip.toBuffer())
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
