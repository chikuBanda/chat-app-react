import { User } from "./user"

export interface IConversation {
    id: string
    user_uid_list: string[]
    members: Partial<User>[]
    messages: IMessage[]
    last_message: IMessage
}

export interface IMessage {
    content: string
    time_sent: string
    sender_id: string
    receiver_id: string
}