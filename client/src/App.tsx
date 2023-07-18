import "./App.css"
import MyNavbar from "./components/MyNavbar"
import { useEffect, useState } from "react"
import BoardTest from "./components/test/BoardTest"
import {
  Category,
  Note,
  NoteService,
  AuthService,
  getLoggedInUser,
  TokenData,
} from "./services/note.service"
import MyModal from "./components/MyModal"
import AuthModal from "./components/AuthModal"
import { Alert } from "react-bootstrap"

export type ModalType = "note" | "category"
type AuthType = "Login" | "Register" | null

export interface ModalData {
  title: string
  label: string
  type: ModalType
}

export interface MyAlert {
  type: string
  message: string
}

const noteService = new NoteService()
const authService = new AuthService()

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<MyAlert | null>(null)
  const [LoggedIn, setLoggedIn] = useState<{
    isLogin: boolean
    user: TokenData | null
  }>({ isLogin: false, user: null })

  const [showAuthModal, setShowAuthModal] = useState<{
    show: boolean
    type: AuthType
    busy: boolean
    error: string | null
  }>({ show: false, type: null, busy: false, error: null })
  const [showModal, setShowModal] = useState(false)
  const [modaData, setModalData] = useState<ModalData>({
    label: "",
    title: "",
    type: "category",
  })

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
    setCategories([...categories])
    setIsLoading(false)
  }

  const handleDeleteCategory = async (category: Category) => {
    setIsLoading(true)
    try {
      await noteService.deleteCategory(category)
      setCategories(categories.filter((c) => c.id !== category.id))
    } catch (error) {
      console.log(error)
    }
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
    const user = getLoggedInUser()
    console.log("USER: ", user)
    if (user) {
      setLoggedIn({ isLogin: true, user })
      setIsLoading(true)
      const cats = await noteService.getCategories()
      setCategories(cats)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const handleAlert = (type: string, message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 2000)
  }
  const handleClose = () => setShowModal(false)
  const handleShow = (title: string, label: string, type: ModalType) => {
    // If categories empty, show error
    if (type === "note" && categories.length === 0) {
      handleAlert("danger", "Create a category first")
      return
    }
    setModalData({ title, label, type })
    setShowModal(true)
  }

  const handleCloseAuth = () =>
    setShowAuthModal({ show: false, type: null, busy: false, error: null })
  const handleShowAuth = (type: AuthType) =>
    setShowAuthModal({ show: true, type, busy: false, error: null })

  return (
    <>
      {showAuthModal.type && (
        <AuthModal
          onClose={handleCloseAuth}
          onLogin={({ email, password }) => {
            // console.log("CREDS: ", credentials)
            authService
              .login(email, password)
              .then(({ status, error, data }) => {
                if (error) {
                  setShowAuthModal({ ...showAuthModal, error: error })
                  return
                }

                setShowAuthModal({
                  show: false,
                  type: null,
                  busy: false,
                  error: null,
                })
                init()
              })
          }}
          onRegister={({ email, name, password, passwordConfirm }) => {
            // console.log("CREDS: ", credentials)
            setShowAuthModal({ ...showAuthModal, busy: true })
            authService
              .register(email, name, password, passwordConfirm)
              .then(({ status, error, data }) => {
                if (error) {
                  setShowAuthModal({ ...showAuthModal, error: error })
                  return
                }
                setShowAuthModal({
                  show: false,
                  type: null,
                  busy: false,
                  error: null,
                })
                init()
              })
              .catch((err) => {
                setShowAuthModal({ ...showAuthModal, busy: false })
                console.log(
                  "REGISTER ERROR: ",
                  err.json().then((error: any) => console.log(error))
                )
              })
          }}
          type={showAuthModal.type}
          busy={showAuthModal.busy}
          showModal={showAuthModal.show}
          error={showAuthModal.error}
        />
      )}
      <MyModal
        categories={categories}
        showModal={showModal}
        modalData={modaData}
        handleClose={handleClose}
        handleSubmit={(data) => {
          console.log("Modal Data: ", data)

          if (data.type === "note" && data.categoryId) {
            handleCreateNote(data.value, data.categoryId)
          } else {
            handleCreateCategory(data.value)
          }
        }}
        onDeleteCategory={(category) => handleDeleteCategory(category)}
      />
      <MyNavbar
        onNewDoc={() => handleShow("New Note", "Label", "note")}
        onNewCategory={() =>
          handleShow("Manage Category", "New Category Label", "category")
        }
        LoggedIn={LoggedIn}
        onLogin={() => {
          // authService.login(email, password)
          // noteService.getCategories()
          handleShowAuth("Login")
        }}
        onRegister={() => {
          handleShowAuth("Register")
        }}
        onLogout={() => {
          document.cookie = "jwt=; max-age=0"
          setCategories([])
          setLoggedIn({ isLogin: false, user: null })
        }}
      />
      {!LoggedIn.isLogin && (
        <div className='container'>
          <Alert variant='warning'>You are not logged in!</Alert>
        </div>
      )}
      {LoggedIn.isLogin && (
        <div className='container'>
          <BoardTest
            alert={alert}
            isLoading={isLoading}
            selectedNote={selectedNote}
            selectedNoteId={selectedNoteId}
            categories={categories}
            onNoteSelected={handleNoteSelected}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      )}
    </>
  )
}

export default App
