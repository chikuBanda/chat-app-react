import { useRef, useState } from 'react'
import './App.css'
import PeerConnectionComponent from './PeerConnectionComponent'

console.log('MY_VAR', import.meta.env.VITE_MY_VAR)
console.log('MODE', import.meta.env.MODE)
console.log('PROD', import.meta.env.PROD)
console.log('DEV', import.meta.env.DEV)

const openMediaDevices = async (constraints: MediaStreamConstraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints)
}

const openShareScreen = async (constraints: any) => {
  return await navigator.mediaDevices.getDisplayMedia(constraints)
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const shareRef = useRef<HTMLVideoElement>(null)

  const [hasStream, setHasStream] = useState(false)
  const [hasShareStream, setHasShareStream] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  const onClick = async () => {
    try {
      const stream = await openMediaDevices({ 'video': true, 'audio': true })
      console.log('Got MediaStream', stream)
      if (videoRef.current) {
        setHasStream(true)
        setLocalStream(stream)
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing media devices', error)
    }
  }

  const onClickShare = async () => {
    try {
      const stream = await openShareScreen({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        }
      })

      console.log('Got share stream', stream)
      if (shareRef.current) {
        setHasShareStream(true)
        shareRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing media devices', error)
    }
  }
  
  return (
    <>
      
      <h1>Vite + React</h1>
      
      <button onClick={onClick}>Start camera</button>
      <button onClick={onClickShare}>Share screen</button>
      
      <br />
      <br />
      <PeerConnectionComponent stream={localStream} />

      <br /><br />
      <video hidden={!hasStream} ref={videoRef} autoPlay playsInline />
      <video hidden={!hasShareStream} ref={shareRef} autoPlay playsInline />
      <video id='remoteVideo' hidden={true} autoPlay playsInline />
    </>
  )
}

export default App
