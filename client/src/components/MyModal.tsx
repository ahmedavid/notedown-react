import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { Category } from "../services/note.service"

interface Props {
  showModal: boolean
  handleSubmit: (obj: {
    type: "note" | "category"
    categoryId?: number
    value: string
  }) => void
  handleClose: () => void
  modalTitle: string
  modalLabel: string
  modalType: "note" | "category"
  categories: Category[]
}

const MyModal = ({
  showModal,
  handleSubmit,
  handleClose,
  modalLabel,
  modalTitle,
  modalType,
  categories,
}: Props) => {
  const [value, setValue] = useState("")
  const [categoryId, setCategoryId] = useState(categories[0].id)
  const onClose = () => {
    setValue("")
    handleClose()
  }
  return (
    <>
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{modalLabel}</Form.Label>
              <Form.Control
                type='text'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {modalType === "note" && (
              <Form.Group>
                <Form.Label>{modalLabel}</Form.Label>
                <Form.Select
                  aria-label='Default select example'
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
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
                if (modalType === "category") {
                  handleSubmit({ type: modalType, value })
                }
                if (modalType === "note") {
                  handleSubmit({ type: modalType, categoryId, value })
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
