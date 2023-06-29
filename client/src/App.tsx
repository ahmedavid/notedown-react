import "./App.css"
import MyNavbar from "./components/MyNavbar"
import { useEffect, useState } from "react"
import BoardTest from "./components/test/BoardTest"
import NoteService, { Category, Note } from "./services/note.service"
import MyModal from "./components/MyModal"

const noteService = new NoteService()

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string|null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleNoteSelected = (noteId: string | null) => {
    console.log("NOTE ID: ", noteId)
    if (noteId) {
      setIsLoading(true)
      setSelectedNoteId(noteId)
      noteService
        .getNoteById(parseInt(noteId))
        .then((note) => {
          setSelectedNote(note)
          setIsLoading(false)
        })
        .catch((err) => {
          setIsLoading(false)
          console.error(err)
        })
    }
  }

  const handleUpdateNote = async (
    noteId: number,
    categoryId: number,
    content: string
  ) => {
    setIsLoading(true)
    setSelectedNote(null)
    await noteService.updateNote(noteId, content)
    const catIndex = categories.findIndex((c) => c.id === categoryId)
    const noteIndex = categories[catIndex].notes.findIndex(
      (n) => n.id === noteId
    )
    if (noteIndex !== -1) {
      categories[catIndex].notes[noteIndex].content = content
      setCategories([...categories])
    }
    setIsLoading(false)
    setSelectedNote(categories[catIndex].notes[noteIndex])
  }

  const handleCreateNote = async (title: string, categoryId: number) => {
    setIsLoading(true)
    const noteId = await noteService.createNote(title, categoryId)
    console.log("Note Created")
    const cat = categories.find((c) => c.id === categoryId)
    cat?.notes.push({ id: noteId, categoryId, title, content: "" })
    console.log(categories)
    setIsLoading(false)
  }

  const handleCreateCategory = async (title: string) => {
    setIsLoading(true)
    const id = await noteService.createCategory(title)
    categories.push({ id, title, notes: [] })
    setIsLoading(false)
  }

  const handleDeleteNote = async (noteId: number, categoryId: number) => {
    await noteService.deleteNote(noteId)
    const catIndex = categories.findIndex((c) => c.id === categoryId)
    const noteIndex = categories[catIndex].notes.findIndex(
      (n) => n.id === noteId
    )
    if (noteIndex !== -1) {
      categories[catIndex].notes.splice(noteIndex, 1)
      setCategories([...categories])
      setSelectedNote(null)
    }
  }

  const init = async () => {
    setIsLoading(true)
    const cats = await noteService.getCategories()
    setCategories(cats)
    setIsLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalLabel, setModalLabel] = useState("")
  const [modalType, setModalType] = useState<"note" | "category">("note")

  const handleClose = () => setShowModal(false)
  const handleShow = (
    title: string,
    label: string,
    type: "note" | "category"
  ) => {
    setModalTitle(title)
    setModalLabel(label)
    setModalType(type)
    setShowModal(true)
  }

  return (
    <>
      {categories.length > 0 && (
        <MyModal
          categories={categories}
          showModal={showModal}
          modalLabel={modalLabel}
          modalTitle={modalTitle}
          modalType={modalType}
          handleClose={handleClose}
          handleSubmit={(data) => {
            console.log("Modal Data: ", data)
            if (data.categoryId) {
              handleCreateNote(data.value, data.categoryId)
            } else {
              handleCreateCategory(data.value)
            }
          }}
        />
      )}
      <MyNavbar
        onNewDoc={() => handleShow("Note Title", "Note Label", "note")}
        onNewCategory={() =>
          handleShow("Category Title", "Category Label", "category")
        }
      />
      <div className='container'>
        <BoardTest
          isLoading={isLoading}
          selectedNote={selectedNote}
          selectedNoteId={selectedNoteId}
          categories={categories}
          onNoteSelected={handleNoteSelected}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </>
  )
}

export default App
