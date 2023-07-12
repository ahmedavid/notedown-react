import { Alert, Col, Row, Tab } from "react-bootstrap"
import BoardNav from "./BoardNav"
import BoardContent from "./BoardContent"
import { Category, Note } from "../../services/note.service"
import { MyAlert } from "../../App"

interface Props {
  isLoading: boolean
  alert: MyAlert | null
  categories: Category[]
  onNoteSelected: (noteId: string | null) => void
  onUpdateNote: (noteId: number, categoryId: number, content: string) => void
  onDeleteNote: (noteId: number, categoryId: number) => void
  selectedNote: Note | null
  selectedNoteId: string | null
}

const BoardTest = ({
  categories,
  selectedNote,
  selectedNoteId,
  isLoading,
  alert,
  onNoteSelected,
  onUpdateNote,
  onDeleteNote,
}: Props) => {
  return (
    <Tab.Container
      id='noteTab'
      defaultActiveKey='first'
      onSelect={(e) => {
        onNoteSelected(e)
      }}
    >
      <Row>
        <Col sm={3}>
          <BoardNav
            categories={categories}
            isLoading={isLoading}
            selectedNoteId={selectedNoteId}
          />
        </Col>
        <Col sm={9}>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
          <BoardContent
            onDeleteNote={onDeleteNote}
            isLoading={isLoading}
            onUpdateNote={onUpdateNote}
            selectedNote={selectedNote}
          />
        </Col>
      </Row>
    </Tab.Container>
  )
}

export default BoardTest
