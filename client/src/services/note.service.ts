// const baseUrl = "http://localhost:3000/api"

// Monkey patch Fetch API to support interceptors
const { fetch: originalFetch } = window

window.fetch = async (...args) => {
  let [resource, config] = args
  // request interceptor here
  const authHeaders = {
    Authorization: `Bearer ${getLoggedInUserToken()}`,
  }
  // if(resource.toString().includes("/api"))
  const response = await originalFetch(resource, {
    ...config,
    headers: { ...config?.headers, ...authHeaders },
  })

  if (!response.ok) {
    // 404 error handling
    return Promise.reject(response)
  }
  // response interceptor here
  return response
}

// END Monkey patch Fetch API to support interceptors

declare global {
  interface Window {
    API_URL: string
    BUILD_ID: string
  }
}

// let baseUrl = "http://notedown.davidahmadov.net/api"
let baseUrl = "/api"

if (window.API_URL !== "REPLACE_API_URL") {
  baseUrl = window.API_URL
}

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

function parseJwt(token: string) {
  var base64Url = token.split(".")[1]
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join("")
  )

  return JSON.parse(jsonPayload)
}

export interface TokenData {
  id: number
  email: string
  name: string
}

function getLoggedInUserToken() {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  )
  return token
}

function getLoggedInUser() {
  const token = getLoggedInUserToken()
  if (!token) return null
  return parseJwt(token) as TokenData
}

class NoteService {
  categories: Category[] = []

  async createCategory(title: string) {
    const response = await fetch(`${baseUrl}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })

    return (await (response.json() as Promise<{ data: any }>)).data.id
  }

  async deleteCategory(category: Category) {
    if (category.notes.length > 0)
      throw new Error("Only empty categories can be deleted")
    try {
      const response = await fetch(`${baseUrl}/category`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: category.id }),
      })
      await response.json()
    } catch (error) {
      throw new Error("Failed to delete")
    }
  }

  async getCategories(): Promise<Category[]> {
    // if (this.categories.length > 0) return this.categories
    const response = await fetch(baseUrl + "/category")
    const data = await response.json()
    this.categories = data
    return data
  }

  async getNoteById(noteId: number): Promise<Note> {
    await sleep(500)

    const response = await fetch(`${baseUrl}/note/${noteId}`)
    const data = await response.json()
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

class AuthService {
  async login(email: string, password: string) {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    console.log("RESPONSE: ", response)
    console.log("DATA: ", data)

    return { status: response.status, error: data.error, data: data.data }
    // let cookieValue = document.cookie.replace(
    //   /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
    //   "$1"
    // )
    // console.log("JWT: ", cookieValue)

    // const response2 = await fetch(`${baseUrl}/category/11`, {
    //   headers: {
    //     Authorization: `Bearer ${cookieValue}`,
    //   },
    // })
    // console.log("STATUS: ", response2.status)
    // const data2 = await response2.json()
    // console.log(data2)
  }

  async register(
    email: string,
    name: string,
    password: string,
    passwordConfirm: string
  ) {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password, passwordConfirm }),
    })

    if (!response.ok) {
      return Promise.reject(response)
    }

    const data = await response.json()
    return { status: response.status, error: data.error, data: data.data }
  }
}

export { NoteService, AuthService, getLoggedInUser }
