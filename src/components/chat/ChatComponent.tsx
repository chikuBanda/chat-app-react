import '../App.css'
import ConversationListComponent from './ConversationListComponent'
import avatarImg from '../../assets/img/avatar.jpg'
import { Avatar } from '@mui/material'
import { MoreHoriz } from '@mui/icons-material'
import MessageWindowComponent from './MessageWindowComponent'
import useAuthStore from '../../stores/auth'
import { User } from 'firebase/auth'
import { useEffect } from 'react'
import { getConversations } from '../../utils/handlers/chat'
import useChatStore from '../../stores/chat'

console.log('MY_VAR', import.meta.env.VITE_MY_VAR)
console.log('MODE', import.meta.env.MODE)
console.log('PROD', import.meta.env.PROD)
console.log('DEV', import.meta.env.DEV)

const ChatComponent = () => {
  const user: User | null = useAuthStore(state => state.authenticatedUser)
  const setConversations = useChatStore((state) => state.setConversations)
  const setActiveConversation = useChatStore(state => state.setActiveConversation)


  useEffect(() => {
    if (!user) return
    getConversations(user.uid)
      .then(data => {
        setConversations(data)
      })
    return (() => {
      setActiveConversation(null)
    })
  }, [])
  
  return (
    <>
      <div className='grid grid-cols-12 h-full'>
        
        <div className='col-span-3 h-full overflow-auto'>
          <div className="flex items-center my-7 ml-2 mb-12">
              <div className="mr-2">
                  <Avatar sx={{ width: 50, height: 50 }} src={ avatarImg } />
              </div>
              <div className="relative font-sans w-full">
                  <h3 className='my-0 text-slate-800 font-bold'>Chiku banda</h3>
                  <p className='my-0 text-slate-600'>
                    <span className='w-2 h-2 rounded-full bg-green-500 inline-block mr-2'></span>
                    online
                  </p>
                  <button className='absolute top-0 end-0 border-none bg-transparent text-slate-600 text-xl cursor-pointer'><MoreHoriz /></button>
              </div>
          </div>
          <h3 className='text-slate-800 font-bold text-xl ml-2 font-sans'>Conversations</h3>
          <ConversationListComponent />
        </div>

        <div className='col-span-6'>
          <MessageWindowComponent />
        </div>

        <div className='col-span-3'>

        </div>
      </div>
    </>
  )
}

export default ChatComponent
