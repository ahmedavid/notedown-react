import { render, screen } from "@testing-library/react"
import MyModal from "./MyModal"
import { ModalData } from "../App"
import { Category } from "../services/note.service"
import userEvent from "@testing-library/user-event"

test("inputs should be initially empty", () => {
  const handleClose = jest.fn()
  const handleSubmit = jest.fn()
  const modalData = { label: "Label", title: "Title", type: "note" }
  const categories = [
    { id: 1, title: "Category 1" },
    { id: 2, title: "Category 2" },
  ]
  render(
    <MyModal
      showModal={true}
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      modalData={modalData as ModalData}
      categories={categories as Category[]}
    />
  )
  const inputElement = screen.getByRole<HTMLInputElement>("textbox")
  expect(inputElement.value).toBe("sss")
})

test("can type into value input", () => {
  const handleClose = jest.fn()
  const handleSubmit = jest.fn()
  const modalData = { label: "Label", title: "Title", type: "note" }
  const categories = [
    { id: 1, title: "Category 1" },
    { id: 2, title: "Category 2" },
  ]
  render(
    <MyModal
      showModal={true}
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      modalData={modalData as ModalData}
      categories={categories as Category[]}
    />
  )
  const inputElement = screen.getByRole<HTMLInputElement>("textbox", {
    name: modalData.label,
  })
  const noteTitle = "Test Note Title"
  userEvent.type(inputElement, noteTitle)
  expect(inputElement.value).toBe(noteTitle)
})
