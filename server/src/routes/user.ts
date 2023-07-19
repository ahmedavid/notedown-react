import express from "express"
const router = express.Router()
import fs from "fs"
import multer from "multer"
import AdmZip from "adm-zip"
import { prisma } from "../db"
import { UserRequest } from "../middleware/auth"

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({ storage })

router.post(`/import`, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Archive file required" })
  const userId = (req as UserRequest).user.id
  try {
    const zip = new AdmZip(req.file.path)
    const zipEntries = zip.getEntries()

    for (const entry of zipEntries) {
      if (!entry.isDirectory) {
        const jsonData = zip.readAsText(entry)
        const { categories } = JSON.parse(jsonData)[0]
        for (const category of categories) {
          const { title, notes } = category
          const createdCategory = await prisma.category.create({
            data: { title, userId },
          })

          for (const note of notes) {
            await prisma.note.create({
              data: {
                title: note.title,
                content: note.content,
                categoryId: createdCategory.id,
              },
            })
          }
        }
      }
    }

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path)

    return res.status(201).json({ data: "import success" })
  } catch (error) {
    return res.status(400).json({ error: "Import failed" })
  }

  res.send(req.file)
})

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
