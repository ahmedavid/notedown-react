import express from "express"
const router = express.Router()

import { prisma } from "../db"

router.get("/:noteId", async (req, res) => {
  const noteId = parseInt(req.params.noteId)
  console.log("Note Id:", noteId)
  if (!noteId) return res.json({ error: "Invalid note id", data: null })
  const note = await prisma.note.findUnique({ where: { id: noteId } })
  res.json(note)
})

router.patch("/:noteId", async (req, res) => {
  try {
    const noteId = parseInt(req.params.noteId)
    console.log(noteId)
    console.log(req.body)
    if (!noteId)
      return res
        .status(400)
        .json({ error: "Bad request, Invalid note id", data: null })
    const note = await prisma.note.findUnique({ where: { id: noteId } })
    if (!note)
      return res.status(404).json({ error: "Note not found", data: null })
    await prisma.note.update({
      where: { id: noteId },
      data: { content: req.body.content },
    })
    res.json({ error: null, data: "success" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error", data: null })
  }
})

router.delete(`/:noteId`, async (req, res) => {
  try {
    const noteId = parseInt(req.params.noteId)
    if (!noteId)
      return res.status(400).json({ error: "Bad Request", data: null })
    await prisma.note.delete({ where: { id: noteId } })
    res.json({ error: null, data: "Note Deleted" })
  } catch (error) {
    res.status(500).json({
      error: error,
      data: null,
    })
  }
})

router.post(`/`, async (req, res) => {
  try {
    const { title, categoryId } = req.body
    const note = await prisma.note.create({
      data: {
        categoryId,
        title: title,
        content: "",
      },
    })
    res.status(201).json({ error: null, data: { noteId: note.id } })
  } catch (error) {
    res.json({
      error: error,
      data: null,
    })
  }
})

export default router
