import { Container, Nav, NavDropdown, Navbar, Button } from "react-bootstrap"

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
            {/* <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
