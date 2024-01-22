import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// @ts-expect-error: Dependency is there
import type {} from '@redux-devtools/extension' // required for devtools typing
import { IConversation, IMessage } from "../models/interfaces/interfaces";

interface ChatState {
    activeConversation: IConversation | null,
    conversations: IConversation[],
    setActiveConversation: (conversation: IConversation | null) => void,
    setConversations: (conversations: IConversation[]) => void,
    setMessages: (messages: IMessage[]) => void,
    replaceConversations: (conversations: IConversation[]) => void
}

const useChatStore = create<ChatState>() (
    devtools(
        persist(
            (set) => ({
                activeConversation: null,
                conversations: [],
                setActiveConversation: (conversation: IConversation | null) => set(() => ({
                    activeConversation: conversation
                })),
                setConversations: (conversations: IConversation[]) => set(() => ({
                    conversations: conversations
                })),
                setMessages: (messages: IMessage[]) => set((state) => {
                    const activeConversation = state.activeConversation
                    if (activeConversation) {
                        activeConversation.messages = messages
                    }

                    return {
                        activeConversation: activeConversation
                    }
                }),
                replaceConversations: (conversations: IConversation[]) => set((state) => {
                    // let conversationsCopy = state.conversations
                    const conversationsCopy = [...state.conversations];
                    console.log('replaceConversations', conversations)

                    conversations.forEach(conversation => {
                        const index = conversationsCopy.findIndex(c => c.id === conversation.id)
                        if (index !== -1) {
                            conversationsCopy[index] = conversation
                            if (state.activeConversation?.id === conversation.id) {
                                state.activeConversation = conversation
                            }
                        } else {
                            conversationsCopy.push(conversation)
                        }
                    })

                    return {
                        conversations: conversationsCopy
                    }
                })
            }),
            {
                name: 'chat-store'
            }
        )
    )
)

export default useChatStore;