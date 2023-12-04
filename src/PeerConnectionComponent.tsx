import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

interface Message {
    sender_id: string, 
    receiver_id: string, 
    message: string
}

interface props {
    stream: MediaStream | null
}

const WebSocketComp = ({ stream }: props) => {
    const [username, setUsername] = useState('')
    const [message, setMessage] = useState('')
    const [receiver, setReceiver] = useState('')
    const [chat, setChat] = useState<Message[]>([])

    // deployed to render
    const socket = io('wss://chat-app-server-gmhe.onrender.com/events')
    const configuration = { 'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}] }
    const peerConnection = new RTCPeerConnection(configuration)

    useEffect(() => {
        if (stream) {
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
            })
        }
    }, [ stream ])

    // receive message from the server
    socket.on("events", (arg: any) => {
        console.log('received message', arg)
    })

    socket.on('sendMessage', (arg: Message) => {
        console.log('received message', arg)
        setChat(prevArray => [...prevArray, arg])
    })

    socket.on('offer', async (arg: any) => {
        console.log('received offer')
        console.log('offer message', arg)
        if (arg.offer) {
            try {
                console.log('signaling state', peerConnection.signalingState)
                if (peerConnection.signalingState !== 'stable') {
                    console.warn('Cannot handle offer in signaling state:', peerConnection.signalingState);
                    return;
                }

                await peerConnection.setRemoteDescription(new RTCSessionDescription(arg.offer));
                console.log('set offer as remote desc.')
                const answer = await peerConnection.createAnswer();
                console.log('created answer.')
                await peerConnection.setLocalDescription(answer);
                console.log('set answer as local desc.')
                console.log('signaling state', peerConnection.signalingState)

                sendMessage('answer', { answer });
                console.log('sending answer...')
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        }
    })

    socket.on('answer', async (arg: any) => {
        console.log("received answer")
        console.log('answer message', arg)
        if (arg.answer) {
            console.log('signaling state', peerConnection.signalingState)
            const remoteDesc = new RTCSessionDescription(arg.answer)
            await peerConnection.setRemoteDescription(remoteDesc)
            console.log("set answer as remote desc")
            console.log('signaling state', peerConnection.signalingState)
        }
    })

    socket.on('new-ice-candidate',async (arg: any) => {
        if (arg.ice_candidate) {
            try {
                await peerConnection.addIceCandidate(arg.ice_candidate)
            } catch (e) {
                console.error('Error adding received ice candidate', e)
            }
        }
    })

    peerConnection.addEventListener('icecandidate', event => {
        console.log('on icecandidate')
        if (event.candidate) {
            sendMessage('new-ice-candidate', { ice_candidate: event.candidate })
        }
    })

    peerConnection.addEventListener('connectionstatechange', event => {
        console.log('connectionstatechange', event)
        if (peerConnection.connectionState === 'connected') {
            console.log("CONNECTED")
        }
    })

    const remoteVideo: HTMLVideoElement | null = document.querySelector('#remoteVideo')

    peerConnection.addEventListener('track', async (event) => {
        const [remoteStream] = event.streams
        if (remoteVideo) {
            remoteVideo.srcObject = remoteStream 
            remoteVideo.hidden = false
        }
    })

    const onRegister = () => {
        socket.emit('register', {
            id: username
        }, onServerResponse)
    }

    const onSendMessage = () => {
        const msg = {
            sender_id: username, 
            receiver_id: receiver, 
            message: message
        }
        socket.emit('sendMessage', msg, onServerResponse)

        setChat(prevArray => [...prevArray, msg])
    }

    const sendMessage = (eventName: string, msgObject: any) => {
        const msg = {
            sender_id: username, 
            receiver_id: receiver, 
            ...msgObject
        }
        socket.emit(eventName, msg, onServerResponse)
    }

    const onServerResponse = (data: any) => {
        console.log('server response', data)
    }

    const renderChat = () => {
        if (chat.length > 0) {

            return (
                chat.map((msg, index) => {
                    return (
                        msg.sender_id === username ?
                        <h3 key={ index } style={{ color: 'teal' }}>{msg.message}</h3> :
                        <h3 key={ index } style={{ color: 'green' }}>{msg.message}</h3>
                    )
                })
            )
        } else {
            return null
        }
    }

    const makeCall = async () => {
        const offer = await peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
        console.log('created offer')
        await peerConnection.setLocalDescription(offer)
        console.log('set offer as local desc')

        sendMessage('offer', { offer })
        console.log('Makeing call...')
        console.log('Sending offer...')
    }

    return (
        <>
            <div>
                { renderChat() }
            </div>
            <div>
                <label htmlFor="username">Your id</label>
                <input 
                    id='username'
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                <button 
                    disabled={username == '' || username == null} 
                    onClick={onRegister} 
                    >Connect</button>
                <br />
            </div>

            <div>
                <div>
                    <label htmlFor="receiver">Your friend's id</label>
                    <input 
                        id='receiver'
                        type="text"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                        />
                </div>
                
                <br />
                <br />

                
                <button style={{backgroundColor: 'green'}} onClick={makeCall}>
                    Make call
                </button>
                <br />
                <br />

                <div>
                    <textarea 
                        name="message_box"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        ></textarea>
                    <div>
                    <button 
                        onClick={onSendMessage}
                        style={{'backgroundColor': 'teal', 'color': 'white'}}
                        >Send message</button>
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default WebSocketComp