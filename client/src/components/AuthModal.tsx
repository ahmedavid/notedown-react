import { useState } from "react"
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap"

interface Credentials {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

interface Props {
  showModal: boolean
  type: "Login" | "Register"
  error: string | null
  busy: boolean
  onClose: () => void
  onLogin: (credentials: Credentials) => void
  onRegister: (credentials: Credentials) => void
}

const AuthModal = ({
  showModal,
  type,
  busy,
  error,
  onClose,
  onLogin,
  onRegister,
}: Props) => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  return (
    <>
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{type}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label htmlFor='email'>Email</Form.Label>
              <Form.Control
                type='email'
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {type === "Register" && (
              <Form.Group>
                <Form.Label htmlFor='name'>Name</Form.Label>
                <Form.Control
                  type='name'
                  id='name'
                  name='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label htmlFor='password'>Password</Form.Label>
              <Form.Control
                type='password'
                id='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {type === "Register" && (
              <Form.Group>
                <Form.Label htmlFor='passwordConfirm'>
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type='password'
                  id='passwordConfirm'
                  name='passwordConfirm'
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                ></Form.Control>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            disabled={busy}
            variant='primary'
            onClick={() => {
              if (type === "Register") {
                onRegister({ email, name, password, passwordConfirm })
              }

              if (type === "Login") {
                onLogin({ email, name: "", password, passwordConfirm })
              }
            }}
          >
            <span className='mx-1'>{type}</span>
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

export default AuthModal
