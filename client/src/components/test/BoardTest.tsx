import { Col, Nav, Row, Tab } from "react-bootstrap"
import BoardNav from "./BoardNav"
import BoardContent from "./BoardContent"
import { Category, Note } from "../../services/note.service"

interface Props {
  isLoading: boolean
  categories: Category[]
  onNoteSelected: (noteId: string | null) => void
  onUpdateNote: (noteId: number, categoryId: number, content: string) => void
  onDeleteNote: (noteId: number, categoryId: number) => void
  selectedNote: Note | null
}

const BoardTest = ({
  categories,
  selectedNote,
  isLoading,
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
          <BoardNav categories={categories} isLoading={isLoading} />
        </Col>
        <Col sm={9}>
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
