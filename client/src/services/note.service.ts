// const baseUrl = "http://localhost:3000/api"
const baseUrl = "http://api.davidahmadov.net/api"

export interface Category {
  id: number
  title: string
  notes: Note[]
}

export interface Note {
  id?: number
  categoryId: number
  title: string
  content: string
}

async function sleep(ms: number) {
  return new Promise((res, rej) => {
    setTimeout(() => res(true), ms)
  })
}

class NoteService {
  categories: Category[] = []

  async createCategory(title: string) {
    const response = await fetch(`${baseUrl}/category/8`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })

    return (await (response.json() as Promise<{ data: any }>)).data.id
  }

  async getCategories(): Promise<Category[]> {
    if (this.categories.length > 0) return this.categories
    const response = await fetch(baseUrl + "/category/4")
    const data = await response.json()
    this.categories = data
    return data
  }

  async getNoteById(noteId: number): Promise<Note> {
    await sleep(500)

    const response = await fetch(`${baseUrl}/note/${noteId}`)
    const data = await response.json()
    console.log("NOTE DATA: ", data)
    return data
  }

  async updateNote(noteId: number, content: string) {
    await fetch(`${baseUrl}/note/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
  }

  async deleteNote(noteId: number) {
    await fetch(`${baseUrl}/note/${noteId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
  }

  async createNote(title: string, categoryId: number): Promise<number> {
    const response = await fetch(`${baseUrl}/note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, categoryId }),
    })
    const { data } = await (response.json() as Promise<{
      error: any
      data: any
    }>)
    return data.noteId
  }
}

export default NoteService
