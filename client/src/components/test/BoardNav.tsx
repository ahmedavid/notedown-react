import { Accordion, Badge, Nav, NavItem, Spinner } from "react-bootstrap"
import { Category } from "../../services/note.service"

interface Props {
  isLoading: boolean
  selectedNoteId: string | null
  categories: Category[]
}

const BoardNav = ({ categories, isLoading,selectedNoteId }: Props) => {
  return (
    <div>
      {categories.map((category) => (
        <Accordion key={category.id}>
          <Accordion.Header>
            {category.title}{" "}
            <Badge className='mx-1' bg='success'>
              {category.notes.length}
            </Badge>
          </Accordion.Header>
          <Accordion.Body style={{ padding: 0 }}>
            <Nav variant='pills' className='flex-column'>
              {category.notes.map((note) => (
                <Nav.Item key={note.id}>
                  <Nav.Link
                    eventKey={note.id}
                    className='nav-link-pointer'
                    disabled={isLoading}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{note.title}</span>
                    {(selectedNoteId === note.id+"") && isLoading && (
                      <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                      />
                    )}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Accordion.Body>
        </Accordion>
      ))}
    </div>
  )
}

export default BoardNav
