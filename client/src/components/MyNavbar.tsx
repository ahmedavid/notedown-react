import { Container, Nav, Navbar, Button, ButtonGroup } from "react-bootstrap"
import { TokenData } from "../services/note.service"

interface Props {
  LoggedIn: { isLogin: boolean; user: TokenData | null }
  onNewDoc: () => void
  onNewCategory: () => void
  onLogin: () => void
  onRegister: () => void
  onLogout: () => void
}

const MyNavbar = ({
  LoggedIn,
  onNewDoc,
  onNewCategory,
  onLogin,
  onRegister,
  onLogout,
}: Props) => {
  return (
    <Navbar bg='light' expand='lg' className='my-2'>
      <Container>
        <Navbar.Brand href='#home'>NoteDown</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            {LoggedIn.isLogin && (
              <>
                <Button onClick={onNewDoc}>New Note</Button>
                <Button onClick={onNewCategory} className='mx-2'>
                  Manage Category
                </Button>
                <span>{LoggedIn.user?.email}</span>
              </>
            )}

            {/* <span>{window.API_URL} v4 </span>
            <span> | {window.BUILD_ID}</span> */}
          </Nav>

          {!LoggedIn.isLogin && (
            <>
              <ButtonGroup>
                <Button variant='success' onClick={() => onLogin()}>
                  Login
                </Button>
                <Button onClick={() => onRegister()}>Register</Button>
              </ButtonGroup>
            </>
          )}

          {LoggedIn.isLogin && (
            <Button variant='warning' onClick={onLogout} className='mx-2'>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
