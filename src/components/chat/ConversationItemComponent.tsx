import { Avatar } from '@mui/material'
import { IConversation } from '../../models/interfaces/interfaces'
import useAuthStore from '../../stores/auth'
import { useEffect } from 'react'
import useChatStore from '../../stores/chat'


const ConversationItemComponent = ({conversation}: {conversation: IConversation}) => {
    const user = useAuthStore(state => state.authenticatedUser)
    const otherUser = conversation.members.find(u => u.uid !== user?.uid)
    const setActiveConversation = useChatStore(state => state.setActiveConversation)
    const activeConversation = useChatStore(state => state.activeConversation)

    useEffect(() => {
        console.log('otherUser', otherUser)
    }, [])

    return (
        <>
            <div onClick={() => setActiveConversation(conversation)} 
                className={ "flex items-center my-7 cursor-pointer hover:bg-sky-100 p-2 rounded-lg" + (activeConversation?.id === conversation.id ? ' bg-sky-200' : '')} >
                <div className="mr-2">
                    <Avatar src={ otherUser?.photoURL || '' } />
                </div>
                <div className="relative font-sans w-full">
                    <h4 className='my-0 text-slate-800 font-bold'><span> { conversation.last_message?.sender_id === user?.uid ? 'You: ' : '' } </span>{ otherUser?.displayName || '' }</h4>
                    <p className='my-0 text-slate-600'>{ conversation.last_message?.content || '' }</p> 
                    <small className='absolute top-0 end-2'>11:55</small>
                </div>
            </div>
        </>
    )
}

export default ConversationItemComponent