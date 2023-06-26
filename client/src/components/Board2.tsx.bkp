import { Button, Col, Form, Modal, Nav, Row, Tab, Tabs } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import MarkdownEditor from 'rich-markdown-editor'
import db, { IMarkdownDocument } from '../services/dbservice'
import styled from 'styled-components'

const MarkdownEditorContainer = styled.div`
  height: 90vh;
`

interface IProps {
  showModal: boolean
  handleClose: () => void
}

const Board = ({showModal, handleClose}: IProps) => {
  // const [showMarkdown, setShowMarkdown] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [docs, setDocs] = useState<IMarkdownDocument[]>([])
  const [currDoc, setCurrDoc] = useState<IMarkdownDocument | null>(null)
  const [editing, setEditing] = useState(false)

  const handleInitDoc = () => {
    if(title.length === 0) return
    const newDoc: IMarkdownDocument = {
      id: 'new',
      title,
      content: ''
    }
    setDocs([newDoc,...docs])
    setCurrDoc(newDoc)
    setTitle('')
    handleClose()
  }

  const handleSaveDoc = async () => {
    if(currDoc) {
      if(currDoc.content.length === 0) {
        // creating a new doc
        currDoc.content = content
        setContent("")
        await db.create(currDoc)
      } else {
        // updating an existing doc
        currDoc.content = content
        await db.update(currDoc.id, currDoc)
      }
      init()
    }
    setEditing(false)
  }

  const handleDeleteDoc = (id: string) => {
    if(window.confirm("Delete?")) {
      db.delete(id)
      init()
    }
  }

  const handleEditDoc = () => {
    setEditing(true)
  }

  const handleDocChange = (e: any) => {
    setContent(e())
  }

  const init = async () => {
    const docs = await db.getAll()
    setDocs(docs)
  }

  const renderModal = () => {
    return(
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Markdown Document</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Document Title</Form.Label>
              <Form.Control type='text' value={title} onChange={e => setTitle(e.target.value)}></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleInitDoc}>Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  useEffect(() => {
    init()
  }, [])

  if(docs.length === 0) return (
    <>
    <div>Nothing Just Yet...</div>
    {renderModal()}
    </>
  )

  return (
    <>
    <Tab.Container id="left-tabs-example" defaultActiveKey={docs[0].id} onSelect={e => {
      setEditing(false)
      const d = docs.find(x => x.id === e)
      if(d) {
        setCurrDoc(d)
      }

    }}>
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column mt-3">
            {
              docs.map((doc) => {
                return (
                  <Nav.Item key={doc.id}>
                    <Nav.Link style={{cursor: 'pointer'}} eventKey={doc.id}>{doc.title}</Nav.Link>
                  </Nav.Item>
                )
              })
            }
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content className='container mt-3'>
            {
              docs.map((doc) => {
                return (
                  <Tab.Pane eventKey={doc.id} key={doc.id} >
                    <MarkdownEditorContainer>
                      <div className='actionButtons btn-group'>
                        {!editing && <Button size='sm' variant='warning' onClick={handleEditDoc}>Edit</Button>}
                        {editing && <Button size='sm' variant='success' onClick={handleSaveDoc}>Save</Button>}
                        {editing && <Button size='sm' variant='warning' onClick={() => setEditing(false)}>Cancel</Button>}
                        {!editing && <Button size='sm' variant='danger' onClick={() => handleDeleteDoc(doc.id)}>Delete</Button>}
                      </div>
                      <MarkdownEditor readOnly={!editing} autoFocus={editing}  defaultValue={doc.content} onChange={handleDocChange}></MarkdownEditor>
                    </MarkdownEditorContainer>
                  </Tab.Pane>
                )
              })
            }
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>

    {renderModal()}
    </>
  )
}

export default Board