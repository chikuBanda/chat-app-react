import { Outlet } from "react-router-dom"
import HeaderComponent from "./shared/HeaderComponent";
import SideBarComponent from "./SideBarComponent";
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from "../firebase/firebase"
import useAuthStore from "../stores/auth";
import { useEffect } from "react";
import { IConversation } from "../models/interfaces/interfaces";
import useChatStore from "../stores/chat";

const HomeComponent = () => {
    const user = useAuthStore(state => state.authenticatedUser)
    const replaceConversations = useChatStore((state) => state.replaceConversations)

    useEffect(() => {
        const q = query(collection(db, "conversations"), where("user_uid_list", "array-contains", user?.uid))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let conversations: IConversation[] = []
            snapshot.docChanges().forEach((change) => {
                console.log('CONVERSATION CHANGE', change.doc.data())
                let conversation = {
                    ...change.doc.data() as IConversation
                }
                conversation.id = change.doc.id
                conversations.push(conversation)
            })

            replaceConversations(conversations)
        })

        return () => {
            unsubscribe()
        }
    })

    return (
        <>
            <div className="h-screen overflow-hidden">
                <div className="grid grid-cols-7 2xl:px-40 h-full">
                    <div className="col-span-1 h-full overflow-hidden">
                        <SideBarComponent />
                    </div>
                    <main className="col-span-6 h-full flex flex-col overflow-hidden">
                        <div className="max-w-full">
                            <HeaderComponent />
                        </div>
                        <div className="col-span-6 px-5 pt-5 overflow-auto h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div> 
        </>
    )
}

export default HomeComponent