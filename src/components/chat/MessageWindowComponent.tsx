import { MoreHoriz, Send, Call, VideoCall } from "@mui/icons-material"
import { Avatar, Button } from "@mui/material"
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import useAuthStore from "../../stores/auth";
import useChatStore from "../../stores/chat";
import { useState } from "react";
import { sendTextMessage } from "../../utils/handlers/chat";
import { IMessage } from "../../models/interfaces/interfaces";
import { Timestamp } from "firebase/firestore";
import useRtcStore from "../../stores/rtc";
import { useNavigate } from "react-router-dom";

const MessageWindowComponent = () => {
    const navigate = useNavigate()
    const user = useAuthStore(state => state.authenticatedUser)
    const [text_message, setTextMessage] = useState('')
    const activeConversation = useChatStore(state => state.activeConversation)
    const otherUser = activeConversation ? activeConversation.members.find(u => u.uid !== user?.uid) : null
    const signalingServerSocketConnection = useRtcStore(state => state.signalingServerSocketConnection)
    const setLocalStream = useRtcStore(state => state.setLocalStream)

    const setCallStatus = useRtcStore(state => state.setCallStatus)
    const setCallerId = useRtcStore(state => state.setCallerId)
    const setCalleeId = useRtcStore(state => state.setCalleeId)

    const openMediaDevices = async (constraints: MediaStreamConstraints) => {
        return await navigator.mediaDevices.getUserMedia(constraints)
    }

    const getLocalMediaStream = async () => {
        try {
            const stream = await openMediaDevices({ 'video': true, 'audio': true })
            console.log('Got MediaStream', stream)
            setLocalStream(stream)
        } catch (error) {
            console.error('Error accessing media devices', error)
        }
    }

    const sendMessage = async () => {
        if (text_message.length > 0 && activeConversation && user?.uid && otherUser?.uid) {
            const message: IMessage = {
                sender_id: user?.uid,
                receiver_id: otherUser?.uid,
                content: text_message,
                time_sent: Timestamp.now()
            }

            try {
                await sendTextMessage(activeConversation?.id, message)
                setTextMessage('')
                console.log('Message sent')
            } catch (error) {
                console.log('Error sending message')
                console.error(error)
            }
        }
    }

    const renderChat = () => {

        return activeConversation?.messages.map((message, index) => {
            if (message.sender_id === user?.uid) {
                return (
                    <div key={index} className="flex pt-5 justify-end">
                        <div className="bg-slate-200 p-2 rounded-lg rounded-tr-none shadow" style={{ width: 'fit-content' }}>
                            {message.content}
                        </div>
                        <div className="ml-2">
                            <Avatar className="shadow" sx={{ width: 30, height: 30 }} src={user?.photoURL ? user.photoURL : ''} />
                        </div>
                    </div>
                )
            } else if (message.sender_id === otherUser?.uid) {
                return (
                    <div key={index} className="flex pt-5">
                        <div className="mr-2">
                            <Avatar className="shadow" sx={{ width: 30, height: 30 }} src={otherUser?.photoURL ? otherUser.photoURL : ''} />
                        </div>
                        <div className="bg-slate-200 p-2 rounded-lg rounded-tl-none shadow" style={{ width: 'fit-content' }}>
                            {message.content}
                        </div>
                    </div>
                )
            }
        })
    }

    const onServerResponse = (data: unknown) => {
        console.log('server response', data)
    }

    const sendSocketMessage = (eventName: string, msgObject: { [key: string]: unknown }) => {
        const msg = {
            sender_id: user?.uid,
            receiver_id: otherUser?.uid,
            ...msgObject
        }
        signalingServerSocketConnection?.emit(eventName, msg, onServerResponse)
    }

    const startCall = async () => {
        await getLocalMediaStream()
        setCallStatus('outgoing')
        
        if (user?.uid && otherUser?.uid) {
            setCallerId(user.uid)
            setCalleeId(otherUser.uid)
        }

        sendSocketMessage('call', { call_type: 'video' })
        navigate('/app/call-room')
    }

    return (
        <>
            <div className="flex flex-col h-144 overflow-hidden">
                <div className="flex items-center mx-8 pb-2 border-solid border-0 border-b border-slate-500">
                    <div className="mr-2">
                        <Avatar sx={{ width: 50, height: 50 }} src={otherUser?.photoURL ? otherUser.photoURL : ''} />
                    </div>
                    <div className="relative font-sans w-full">
                        <h3 className='my-0 text-slate-800 font-bold'> {otherUser?.displayName} </h3>
                        <p className='my-0 text-slate-600'>
                            <span className='w-2 h-2 rounded-full bg-green-500 inline-block mr-2'></span>
                            online
                        </p>
                        <span className="absolute top-4 end-0 ">
                            {/* call button */}
                            <button 
                                onClick={startCall} 
                                className="border-none bg-transparent text-slate-600 text-xl cursor-pointer mr-2"> <Call /> </button>

                            {/* video button */}
                            <button className="border-none bg-transparent text-slate-600 text-xl cursor-pointer mr-2"> <VideoCall /> </button>

                            {/* more button */}
                            <button className='border-none bg-transparent text-slate-600 text-xl cursor-pointer'><MoreHoriz /></button>
                        </span>

                    </div>
                </div>

                {activeConversation != null ?
                    (
                        <div className="mx-8 h-full overflow-auto bg-sky-100 p-4">
                            {renderChat()}
                        </div>
                    ) : (
                        <div className="mx-8 h-full overflow-auto bg-sky-100 p-4">
                            <p className="text-center">Select a conversation to start chatting</p>
                        </div>
                    )
                }


                <div className="mx-8 py-4 px-2 bg-sky-100">
                    <div className="flex items-centerpy-2 px-2 py-3 bg-white rounded-lg shadow">
                        <TextareaAutosize
                            onChange={(e) => setTextMessage(e.target.value)}
                            value={text_message}
                            placeholder="Type a message..." className="w-full p-2 border-none focus:border-none focus:outline-none focus:ring-0 resize-none" />
                        <span className="flex flex-col-reverse">
                            <Button
                                className="bg-sky-500 text-white rounded-full w-10 h-8"
                                variant="contained"
                                size="small"
                                type="button"
                                onClick={sendMessage}>
                                <Send sx={{ fontSize: 16 }} className="text-white" style={{ transform: 'rotate(315deg)' }} />
                            </Button>
                        </span>
                    </div>
                </div>

                {/* {
                    open && (
                        <NewWindow close={handleClose}>
                            <Button>TEST BUTTON</Button>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            {
                                                callStatus === 'outgoing' ?
                                                    (<>Calling {otherUser?.displayName}</>)
                                                    : callStatus === 'rejected' ?
                                                        (<>{otherUser?.displayName} has rejected your call</>)
                                                        : (<></>)
                                            }
                                            <br />
                                            <Button className="bg-red-600 text-white" type="button" variant="contained" onClick={handleHangup}>Hang up</Button>
                                        </DialogContentText>
                                    </DialogContent>
                                </Dialog>
                        </NewWindow>
                    )
                } */}
            </div>
        </>
    )
}

export default MessageWindowComponent