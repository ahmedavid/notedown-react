import { Button, Spinner } from "react-bootstrap"
import MarkdownEditor from "rich-markdown-editor"
import { useState } from "react"
import { Note } from "../../services/note.service"

interface Props {
  isLoading: boolean
  selectedNote: Note | null
  onUpdateNote: (noteId: number, categoryId: number, content: string) => void
  onDeleteNote: (noteId: number, categoryId: number) => void
}

const BoardContent = ({
  selectedNote,
  isLoading,
  onUpdateNote,
  onDeleteNote,
}: Props) => {
  const [content, setContent] = useState("")
  const [editing, setEditing] = useState(false)

  const handleEditDoc = () => {
    setEditing(true)
  }

  const handleDocChange = (e: any) => {
    setContent(e())
  }

  const handleSaveDoc = async () => {
    if (selectedNote && selectedNote.id) {
      onUpdateNote(selectedNote.id, selectedNote.categoryId, content)
    }
    setEditing(false)
  }

  if (!selectedNote && !isLoading) {
    return <div>Select A Note</div>
  }

  if (isLoading)
    return (
      <Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    )
  return (
    <div>
      {selectedNote && (
        <div className='actionButtons btn-group my-2'>
          {!editing && (
            <Button size='sm' variant='warning' onClick={handleEditDoc}>
              Edit
            </Button>
          )}
          {editing && (
            <Button size='sm' variant='success' onClick={handleSaveDoc}>
              Save
            </Button>
          )}
          {editing && (
            <Button
              size='sm'
              variant='warning'
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          )}
          {!editing && (
            <Button
              size='sm'
              variant='danger'
              onClick={() => {
                if (window.confirm()) {
                  selectedNote.id &&
                    selectedNote.categoryId &&
                    onDeleteNote(selectedNote.id, selectedNote.categoryId)
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      )}
      <div>
        <h3>{selectedNote?.title}</h3>
        {selectedNote && (
          <MarkdownEditor
            readOnly={!editing}
            autoFocus={editing}
            defaultValue={selectedNote.content}
            // value={selectedNote.content}
            onChange={handleDocChange}
          ></MarkdownEditor>
        )}
      </div>
    </div>
  )
}

export default BoardContent
