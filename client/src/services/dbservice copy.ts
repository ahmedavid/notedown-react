import { collection, getDocs, addDoc, deleteDoc, getDoc, doc, updateDoc } from "firebase/firestore"; 
import { db } from "../firebase";

const main_collection = 'textwrangler'

export interface IMarkdownDocument {
  id: string
  title: string
  content: string
}


class DBService {
  async getAll() {
    const docs: IMarkdownDocument[] = []
    const querySnapshot = await getDocs(collection(db, main_collection));
    querySnapshot.forEach((doc) => {
      const {title, content} = doc.data();
      const id = doc.id
      const newDoc: IMarkdownDocument = {
        id,
        title,
        content
      }
      docs.push(newDoc)
    });

    return docs
  }

  async create(doc: IMarkdownDocument) {
    const {id,...rest} = doc
    await addDoc(collection(db, main_collection), rest)
  }

  async update(docId: string, document: IMarkdownDocument) {
    const {id,...rest} = document
    const docRef = doc(db,main_collection +'/' + docId)
    try {
      await updateDoc(docRef, {...rest})
      console.log("Success")
    } catch (error) {
      console.log("Fail: ", error)
    }
  }

  async delete(id: string) {
    const docRef = doc(db,main_collection +'/' + id)
    await deleteDoc(docRef)
  }
}

export default new DBService();