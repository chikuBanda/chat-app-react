import { addDoc, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../firebase/firebase'
import { IConversation, IMessage } from "../../models/interfaces/interfaces";

const ref = collection(db, "conversations")

export const getConversations = async (uid: string) => {
  const data = await getDocs(ref)
  return data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
    .filter((conversation: IConversation) => conversation.user_uid_list.includes(uid))   
}

export const getConversation = async (id: string) => {
  const data = await getDoc(doc(db, "conversations", id))
  return data.data()
}

export const createConversation = async (conversation: any) => {
  const data = await addDoc(ref, conversation)
  return data.id
}

export const updateConversation = async (id: string, conversation: any) => {
  const data = await updateDoc(doc(db, "conversations", id), conversation)
  return data
}

export const deleteConversation = async (id: string) => {
  const data = await deleteDoc(doc(db, "conversations", id))
  return data
}

export const sendTextMessage = async (conversation_id: string, message: IMessage) => {
  const data = await updateDoc(doc(db, "conversations", conversation_id), {
    messages: arrayUnion(message)
  })

  await updateDoc(doc(db, "conversations", conversation_id), {
    last_message: message
  })
  
  return data
}