import { useEffect, useState } from "react"
import { Accordion, Button, ListGroup, ListGroupItem } from "react-bootstrap"
import { Category, Note } from "../services/note.service"

interface Props {
  onNoteSelected: (note: Note) => void
  categories: Category[]
}

const SideBar = ({ onNoteSelected, categories }: Props) => {
  // const [categories, setCategories] = useState<Category[]>([])
  return (
    <>
      {categories.map((category) => (
        <Accordion key={category.id}>
          <Accordion.Header>
            {category.title} ({category.notes.length})
          </Accordion.Header>
          <Accordion.Body style={{ padding: "0" }}>
            <ListGroup>
              {category.notes.map((note) => (
                <ListGroupItem
                  key={note.id}
                  className='d-grid'
                  style={{ padding: 0 }}
                >
                  <Button
                    variant='secondary'
                    size='lg'
                    onClick={() => onNoteSelected(note)}
                  >
                    {note.title}
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion>
      ))}
    </>
  )
}

export default SideBar
