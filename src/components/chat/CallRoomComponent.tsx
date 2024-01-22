import { PeopleAlt, AccessTime, Mic, Videocam, Settings, OpenInFull, CallEnd, FiberManualRecord } from "@mui/icons-material";
import { Fab } from "@mui/material";
import useRtcStore from "../../stores/rtc";
import { useRef, useEffect, useState } from "react";
import useAuthStore from "../../stores/auth";

const CallRoomComponent = () => {
    const callStatus = useRtcStore(state => state.callStatus)
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const localStream = useRtcStore(state => state.localStream)
    const setRemoteStream = useRtcStore(state => state.setRemoteStream)
    const user = useAuthStore(state => state.authenticatedUser)
    const callerId = useRtcStore(state => state.callerId)
    const calleeId = useRtcStore(state => state.calleeId)
    const signalingServerSocketConnection = useRtcStore(state => state.signalingServerSocketConnection)
    const iceServers = useRtcStore(state => state.iceServers)
    const setCallStatus = useRtcStore(state => state.setCallStatus)
    const [peerConnection, setPeerConnection] = useRtcStore(state => [state.peerConnection, state.setPeerConnection])
    const [otherUserId, setOtherUserId] = useState<string | null>(null)


    useEffect(() => {
        console.log('in first use effect')

       
        if (user?.uid === callerId) {
            console.log("FIRST")
            setOtherUserId(calleeId)
        } else if (user?.uid === calleeId) {
            console.log("SECOND")
            setOtherUserId(callerId)
        }

        console.log('userid', user?.uid)
        console.log('otheruserid', otherUserId)

        const configuration = { 'iceServers': iceServers }
        setPeerConnection(new RTCPeerConnection(configuration))

        signalingServerSocketConnection?.on('accept-call', async () => {
            console.log('call accepted')
            setCallStatus('accepted')

            // const configuration = { 'iceServers': iceServers }
            // setPeerConnection(new RTCPeerConnection(configuration))
        })

        signalingServerSocketConnection?.on('reject-call', () => {
            console.log('call rejected')
            setCallStatus('rejected')
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        console.log('in second use effect')

        if (peerConnection && localStream && remoteVideoRef.current) {
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    peerConnection?.addTrack(track, localStream)
                })
            }
    
            console.log('peer connection', peerConnection)
            console.log('remote vid', remoteVideoRef.current)
            
            peerConnection?.addEventListener('track', async (event) => {
                const [remoteStream] = event.streams
                
                if (remoteVideoRef.current) {
                    setRemoteStream(remoteStream)
                    remoteVideoRef.current.srcObject = remoteStream 
                }
            })
        }

        if (callStatus === "outgoing" || callStatus === "accepted") {
            console.log("in call component, call status is outgoing")

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream
                localVideoRef.current.play()
            }
        }

        console.log('call status', callStatus)
        console.log('caller id', callerId)
        console.log('callee id', calleeId)
        console.log('user id', user?.uid)
        if (callStatus === 'accepted' && callerId === user?.uid) {
            signalingServerSocketConnection?.on('ready-for-offer', () => {
                console.log('on ready for offer')
    
                const acceptedCallHandler = async () => {
                    if (peerConnection) {
                        await makeOffer()
                    }
                }
        
                acceptedCallHandler()
                    .then(() => console.log('accepted call handler resolved'))
                    .catch(error => console.error('accepted call handler rejected', error))
            })
        }

        if (callStatus === 'accepted' && calleeId === user?.uid) {
            console.log('ready for offer')

            signalingServerSocketConnection?.on('offer', async (arg: { offer: RTCSessionDescriptionInit, sender_id: string, receiver_id: string }) => {
                console.log('received offer')
                console.log('offer message', arg)
    
                if (arg.offer) {
                    try {
                        console.log('setting remote description')
                        console.log('peerConnection', peerConnection)
    
                        if (!peerConnection) {
                            return
                        }
    
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
    
                        sendSocketMessage('answer', { answer });
                        console.log('sending answer...')
    
                        // define events
                        // should later see if this is the best place to define events
                        peerConnection.addEventListener('icecandidate', event => {
                            console.log('on icecandidate')
                            if (event.candidate) {
                                sendSocketMessage('new-ice-candidate', { ice_candidate: event.candidate })
                            }
                        })
    
                        peerConnection.addEventListener('connectionstatechange', event => {
                            console.log('connectionstatechange', event)
                            if (peerConnection.connectionState === 'connected') {
                                console.log("CONNECTED")
                            }
                        })
    
                        signalingServerSocketConnection?.on('new-ice-candidate', async (arg: { ice_candidate: RTCIceCandidateInit }) => {
                            if (arg.ice_candidate) {
                                try {
                                    console.log('received ice candidate')
                                    await peerConnection.addIceCandidate(arg.ice_candidate)
                                } catch (e) {
                                    console.error('Error adding received ice candidate', e)
                                }
                            }
                        })
                    } catch (error) {
                        console.error('Error setting remote description:', error);
                    }
                }
            })

            sendSocketMessage('ready-for-offer', { msg: 'ready for offer' })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callStatus, callerId, localStream, peerConnection, user?.uid])

    const onServerResponse = (data: unknown) => {
        console.log('server response', data)
    }

    const sendSocketMessage = (eventName: string, msgObject: { [key: string]: unknown }) => {
        const msg = {
            sender_id: user?.uid,
            receiver_id: calleeId === user?.uid ? callerId : calleeId,
            ...msgObject
        }
        signalingServerSocketConnection?.emit(eventName, msg, onServerResponse)
    }

    const makeOffer = async () => {
        console.log('peer connection', peerConnection)
        if (!peerConnection) {
            return
        }

        // set on answer in advance
        signalingServerSocketConnection?.on('answer', async (arg: { answer: RTCSessionDescriptionInit, sender_id: string, receiver_id: string }) => {
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

        // define events
        // should later see if this is the best place to define events
        peerConnection.addEventListener('icecandidate', event => {
            console.log('on icecandidate')
            if (event.candidate) {
                sendSocketMessage('new-ice-candidate', { ice_candidate: event.candidate })
            }
        })

        peerConnection.addEventListener('connectionstatechange', event => {
            console.log('connectionstatechange', event)
            if (peerConnection.connectionState === 'connected') {
                console.log("CONNECTED")
            }
        })

        signalingServerSocketConnection?.on('new-ice-candidate', async (arg: { ice_candidate: RTCIceCandidateInit }) => {
            if (arg.ice_candidate) {
                try {
                    console.log('received ice candidate')
                    await peerConnection.addIceCandidate(arg.ice_candidate)
                } catch (e) {
                    console.error('Error adding received ice candidate', e)
                }
            }
        })

        // making call
        const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        })
        console.log('created offer')

        await peerConnection.setLocalDescription(offer)
        console.log('set offer as local desc')

        sendSocketMessage('offer', { offer })
        console.log('Makeing call...')
        console.log('Sending offer...')
    }

    return (
        <>
            <div className="grid grid-cols-12" style={{ height: "80vh" }}>
                <div className="col-span-1">

                </div>

                <div className="col-span-8">
                    <div className="flex mb-4">
                        <div className="flex items-center mr-6">
                            <PeopleAlt className="mr-2" fontSize="medium" />
                            <span className="font-sans font-semibold">Participants</span>
                            <span className="font-sans font-semibold w-8 h-8 rounded bg-sky-200 text-sky-700 flex justify-center items-center ml-2">
                                2
                            </span>
                        </div>

                        <div className="flex items-center ml-2">
                            <AccessTime className="mr-2" fontSize="medium" />
                            <span className="font-sans font-semibold">Time elapsed</span>
                            <span className="font-sans font-semibold w-8 h-8 rounded bg-red-200 text-red-700 flex justify-center items-center ml-2">
                                <span>2</span>
                            </span>
                        </div>

                        <div className="flex items-center ml-auto">
                            <span className="font-sans font-semibold w-8 h-8 rounded bg-teal-600 text-white flex justify-center items-center">
                                <span>+</span>
                            </span>
                            <span className="font-sans font-semibold text-teal-600 ml-2">Add participant</span>
                        </div>
                    </div>

                    <div id="video-container" className="w-full h-full rounded-xl relative">
                        { callStatus === "accepted" &&  
                            (<video
                                ref={remoteVideoRef}
                                autoPlay muted loop
                                className="w-full h-full object-cover rounded-xl">
                            </video>)
                        }
                        { callStatus === "outgoing" && 
                            (
                                <div className="w-full h-full flex justify-center items-center bg-slate-700 rounded-xl">
                                    <div className="w-1/3 h-1/3 flex justify-center items-center bg-white rounded-xl shadow-2xl z-10">
                                        <div>
                                            <p>Calling ...</p>
                                            <Fab className="bg-teal-600 text-white" aria-label="add">
                                                <CallEnd />
                                            </Fab>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        <div id="volume-level-container" className="absolute bottom-0 left-0 mb-8 ml-4 h-28 w-8 bg-slate-600 backdrop-blur-md opacity-70 rounded-2xl p-2 flex justify-center items-center">
                            <div id="volume-level" className="w-2 h-4/5 rounded-full bg-white"></div>
                        </div>

                        <div id="video-controls" className="w-1/2 absolute bottom-0 left-0 right-0 mx-auto mb-8 flex justify-around items-center">
                            <Fab size="medium" className="bg-slate-600 opacity-70 backdrop-blur-md text-white" aria-label="add">
                                <Settings />
                            </Fab>
                            <Fab size="medium" className="bg-slate-600 opacity-70 backdrop-blur-md text-white" aria-label="add">
                                <Mic />
                            </Fab>
                            <Fab className="bg-red-600 text-white" aria-label="add">
                                <CallEnd />
                            </Fab>
                            <Fab size="medium" className="bg-slate-600 opacity-70 backdrop-blur-md text-white" aria-label="add">
                                <Videocam />
                            </Fab>
                            <Fab size="medium" className="bg-slate-600 opacity-70 backdrop-blur-md text-white" aria-label="add">
                                <OpenInFull />
                            </Fab>
                        </div>

                        <div id="elapsed-time" className="absolute w-1/2 top-0 left-0 right-0 mx-auto mt-4 font-sans font-semibold flex justify-center items-center">
                            <Fab variant="extended" size="medium" className="bg-slate-600 opacity-70 backdrop-blur-md text-white" aria-label="add">
                                <FiberManualRecord fontSize="small" className="text-red-600" />
                                <span>00:17</span>
                            </Fab>
                        </div>

                        <div id="participants" className="absolute top-0 right-0 mt-4 mr-4 h-5/6 w-1/3">
                            <div id="participant-1" className="flex justify-center items-center h-1/3 w-full rounded-xl">
                                <video
                                    className="w-full h-full object-cover rounded-xl"
                                    autoPlay muted loop
                                    ref={localVideoRef}
                                    ></video>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-3">

                </div>
            </div>
        </>
    )
}

export default CallRoomComponent;