import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// @ts-expect-error: Dependency is there
import type {} from '@redux-devtools/extension' // required for devtools typing

interface MessageState {
    messages: string[]
    addMessage: (msg: string) => void
}

const useMessageStore = create<MessageState>() (
    devtools(
        persist(
            (set) => ({
                messages: [],
                addMessage: (msg: string) => set((state) => ({
                    messages: state.messages.concat(msg)
                }))
            }),
            {
                name: 'messages-store'
            }
        )
    )
)

export default useMessageStore