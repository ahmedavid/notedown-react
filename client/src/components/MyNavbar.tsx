import { Container, Nav, Navbar, Button } from "react-bootstrap"

interface Props {
  onNewDoc: () => void
  onNewCategory: () => void
}

const MyNavbar = ({ onNewDoc, onNewCategory }: Props) => {
  return (
    <Navbar bg='light' expand='lg' className='my-2'>
      <Container>
        <Navbar.Brand href='#home'>NoteDown</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Button onClick={onNewDoc}>New Note</Button>
            <Button onClick={onNewCategory} className='mx-2'>
              New Category
            </Button>

            <span>{window.API_URL} v3</span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
