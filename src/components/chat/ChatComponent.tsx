// import { useEffect, useRef, useState } from 'react'
import '../App.css'
// import axios, { AxiosResponse } from 'axios'
import ConversationListComponent from './ConversationListComponent'
import avatarImg from '../../assets/avatar.jpg'
import { Avatar } from '@mui/material'
import { MoreHoriz } from '@mui/icons-material'
import MessageWindowComponent from './MessageWindowComponent'

console.log('MY_VAR', import.meta.env.VITE_MY_VAR)
console.log('MODE', import.meta.env.MODE)
console.log('PROD', import.meta.env.PROD)
console.log('DEV', import.meta.env.DEV)

// interface IceServer {
//   urls: string,
//   username?: string,
//   credential?: string
// }

// const openMediaDevices = async (constraints: MediaStreamConstraints) => {
//   return await navigator.mediaDevices.getUserMedia(constraints)
// }

// const openShareScreen = async (constraints: any) => {
//   return await navigator.mediaDevices.getDisplayMedia(constraints)
// }

const ChatComponent = () => {
  // const iceServersUrl = 'https://chat-app-server-gmhe.onrender.com/chat/get_ice_servers'
  // const [iceServerList, setIceServerList] = useState<IceServer[]>([])
  
  // useEffect(() => {
  //   axios.get(iceServersUrl)
  //     .then((response: AxiosResponse<IceServer[]>) => {
  //       setIceServerList(response.data)
  //     })
  // }, [])

  // const videoRef = useRef<HTMLVideoElement>(null)
  // const shareRef = useRef<HTMLVideoElement>(null)

  // const [hasStream, setHasStream] = useState(false)
  // const [hasShareStream, setHasShareStream] = useState(false)
  // const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  // const onClick = async () => {
  //   try {
  //     const stream = await openMediaDevices({ 'video': true, 'audio': true })
  //     console.log('Got MediaStream', stream)
  //     if (videoRef.current) {
  //       setHasStream(true)
  //       setLocalStream(stream)
  //       videoRef.current.srcObject = stream
  //     }
  //   } catch (error) {
  //     console.error('Error accessing media devices', error)
  //   }
  // }

  // const onClickShare = async () => {
  //   try {
  //     const stream = await openShareScreen({
  //       video: {
  //         cursor: 'always',
  //         displaySurface: 'monitor'
  //       }
  //     })

  //     console.log('Got share stream', stream)
  //     if (shareRef.current) {
  //       setHasShareStream(true)
  //       shareRef.current.srcObject = stream
  //     }
  //   } catch (error) {
  //     console.error('Error accessing media devices', error)
  //   }
  // }
  
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
