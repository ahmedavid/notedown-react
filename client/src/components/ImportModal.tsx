import { useRef } from "react"
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap"

interface Props {
  showModal: boolean
  error: string | null
  busy: boolean
  onClose: () => void
  onImport: (file: File) => void
}
const ImportModal = ({ showModal, error, busy, onClose, onImport }: Props) => {
  const fileInput = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form
            id='importForm'
            onSubmit={(e) => {
              e.preventDefault()
              if (
                !fileInput ||
                !fileInput.current ||
                !fileInput.current.files ||
                fileInput.current.files?.length < 1
              )
                return
              const file = fileInput.current.files[0]
              onImport(file)
            }}
          >
            <Form.Group controlId='formFileLg' className='mb-3'>
              <Form.Label>Notedown Archive File</Form.Label>
              <Form.Control
                disabled={busy}
                type='file'
                as='input'
                size='lg'
                accept='.zip'
                ref={fileInput}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            disabled={busy}
            variant='primary'
            type='submit'
            form='importForm'
          >
            <span className='mx-1'>Import</span>
            {busy && (
              <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true'
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ImportModal
