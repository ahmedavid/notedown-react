import { useEffect, useState } from "react"
import { Button, Form, ListGroup, Modal } from "react-bootstrap"
import { Category } from "../services/note.service"
import { ModalData, ModalType } from "../App"

interface Props {
  showModal: boolean
  handleSubmit: (obj: {
    type: ModalType
    categoryId?: number
    value: string
  }) => void
  handleClose: () => void
  modalData: ModalData
  categories: Category[]
  onDeleteCategory: (category: Category) => void
}

const MyModal = ({
  showModal,
  handleSubmit,
  handleClose,
  modalData: { label, title, type },
  categories,
  onDeleteCategory
}: Props) => {
  const [value, setValue] = useState("")
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const onClose = () => {
    setValue("")
    handleClose()
  }

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryId(categories[0].id)
    } else {
      setCategoryId(undefined)
    }
  }, [categories])

  return (
    <>
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label htmlFor='value'>{label}</Form.Label>
              <Form.Control
                type='text'
                id='value'
                name='value'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {type === "note" && (
              <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Select
                  aria-label='Default select example'
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                >
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            {type === "category" && (
              <>
              <ListGroup className="mt-4">
                {categories.map(cat => <ListGroup.Item key={cat.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{cat.title}</span>
                    <Button onClick={() => onDeleteCategory(cat)} disabled={cat.notes.length > 0} variant="danger">Delete</Button>
                  </div>
                </ListGroup.Item>)}
              </ListGroup>
              <span className="fw-light">Note: only empty categories can be deleted</span>
              </>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={() => {
              if (value.length > 0) {
                if (type === "category") {
                  handleSubmit({ type: type, value })
                }
                if (type === "note") {
                  handleSubmit({ type: type, categoryId, value })
                }
                onClose()
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MyModal
