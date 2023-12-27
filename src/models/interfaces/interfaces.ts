import { User } from "./user"
import { Timestamp } from "firebase/firestore";

export interface IConversation {
    id: string
    user_uid_list: string[]
    members: Partial<User>[]
    messages: IMessage[]
    last_message: IMessage
}

export interface IMessage {
    content: string
    time_sent: string | Timestamp
    sender_id: string
    receiver_id: string
}