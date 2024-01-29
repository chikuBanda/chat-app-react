import { Outlet } from "react-router-dom"
import HeaderComponent from "./shared/HeaderComponent";
import SideBarComponent from "./SideBarComponent";
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from "../firebase/firebase"
import useAuthStore from "../stores/auth";
import { useEffect, useState } from "react";
import { IConversation, IceServer } from "../models/interfaces/interfaces";
import useChatStore from "../stores/chat";
import useRtcStore from "../stores/rtc";
import axios, { AxiosResponse } from "axios";
import { io } from "socket.io-client";
import { Dialog, Button, DialogContent, DialogContentText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import audioRingtone from "../assets/sounds/ringtones/zapsplat_multimedia_ringtone_mallets_marimba_smartphone_005_84894.mp3"

const signalingServerUrl = import.meta.env.VITE_SIGNALING_SERVER_URL;

const HomeComponent = () => {
    const iceServerUrl = import.meta.env.VITE_ICE_SERVERS_URL
    const [socket] = useState(io(signalingServerUrl));

    const [open, setOpen] = useState(false);
    const [caller, setCaller] = useState<{
        name: string,
        id: string
    } | null>(null)

    const user = useAuthStore(state => state.authenticatedUser)
    const replaceConversations = useChatStore((state) => state.replaceConversations)
    const setIceServers = useRtcStore((state) => state.setIceServers)
    const setSignalingServerSocketConnection = useRtcStore((state) => state.setSignalingServerSocketConnection)
    const signalingServerSocketConnection = useRtcStore((state) => state.signalingServerSocketConnection)
    const setLocalStream = useRtcStore((state) => state.setLocalStream)
    const setCallStatus = useRtcStore((state) => state.setCallStatus)
    const setCalleeId = useRtcStore((state) => state.setCalleeId)
    const setCallerId = useRtcStore((state) => state.setCallerId)
    const ringtone = useRtcStore((state) => state.ringtone)
    const setRingtone = useRtcStore((state) => state.setRingtone)

    const navigate = useNavigate()

    // socket events
    const initializeSocketEvents = () => {
        socket.on('connect', () => {
            // register socket
            socket.emit('register', {
                id: user?.uid
            }, onServerResponse)

            socket.on('call', (arg: { sender_id: string, receiver_id: string, caller_name: string }) => {
                console.log('received call')
                setCaller({ name: arg.caller_name, id: arg.sender_id })
                setOpen(true)
                ringtone?.play()
            })
        })
    }

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

    const sendSocketMessage = (eventName: string, msgObject: { [key: string]: unknown }, receiver_id?: string) => {
        const msg = {
            sender_id: user?.uid,
            receiver_id: receiver_id,
            ...msgObject
        }
        socket.emit(eventName, msg, onServerResponse)
    }

    // server response

    const onServerResponse = (data: unknown) => {
        console.log('server response', data)
    }

    console.log('ICE SERVER URL', iceServerUrl)
    console.log('in home component')

    // on mount
    useEffect(() => {
        console.log('HOME COMPONENT MOUNTED')
        // subscribe to conversations
        const q = query(collection(db, "conversations"), where("user_uid_list", "array-contains", user?.uid))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const conversations: IConversation[] = []
            snapshot.docChanges().forEach((change) => {
                console.log('CONVERSATION CHANGE', change.doc.data())
                const conversation = {
                    ...change.doc.data() as IConversation
                }
                conversation.id = change.doc.id
                conversations.push(conversation)
            })

            replaceConversations(conversations)
        })

        // get ice servers
        axios.get(iceServerUrl)
            .then((response: AxiosResponse<IceServer[]>) => {
                console.log('ICE SERVERS', response.data)
                setIceServers(response.data)
            })
            .catch(err => {
                console.log('ICE SERVERS ERROR', err)
                console.log('USING DEFAULT ICE SERVERS')
                setIceServers([
                    {
                        urls: 'stun:stun.l.google.com:19302'
                    },
                ])
            })

        // set ringtone
        setRingtone(new Audio(audioRingtone))

        initializeSocketEvents()

        // connect to websocket server
        setSignalingServerSocketConnection(socket)

        console.log('signaling server socket connection', signalingServerSocketConnection)

        // unsubscribe on unmount
        return () => {
            unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClose = () => {
        setOpen(false);

    };

    const handleAcceptCall = async () => {
        setOpen(false)
        ringtone?.pause()

        console.log('getting media stream')
        await getLocalMediaStream()
        setCallStatus('accepted')

        if (user?.uid && caller?.id) {
            setCallerId(caller.id)
            setCalleeId(user.uid)
        }
        
        sendSocketMessage('accept-call', {
            message: 'accept call'
        }, caller?.id)

        navigate('/app/call-room')
    }

    const handleRejectCall = () => {
        console.log('reject call')
        setOpen(false)
        sendSocketMessage('reject-call', {
            message: 'reject call'
        }, caller?.id)
    }

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

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {caller?.name} is calling you.
                        <br />
                        <Button className="mr-2 bg-sky-600 text-white" type="button" variant="contained" onClick={handleAcceptCall}>Accept</Button>
                        <Button className="bg-red-600 text-white" type="button" variant="contained" onClick={handleRejectCall}>Reject</Button>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default HomeComponent