import { create } from "zustand";
// @ts-expect-error: Dependency is there
import type {} from '@redux-devtools/extension' // required for devtools typing
import { IceServer } from "../models/interfaces/interfaces";
import { Socket } from "socket.io-client";

interface RtcState {
    iceServers: IceServer[],
    signalingServerSocketConnection: Socket | null,
    setSignalingServerSocketConnection: (socket: Socket) => void,
    setIceServers: (iceServers: IceServer[]) => void,
    localStream: MediaStream | null,
    setLocalStream: (stream: MediaStream) => void,
    remoteStream: MediaStream | null,
    setRemoteStream: (stream: MediaStream) => void,
    peerConnection: RTCPeerConnection | null,
    setPeerConnection: (peerConnection: RTCPeerConnection) => void,
    callStatus: 'incoming' | 'outgoing' | 'none' | 'rejected' | 'accepted' | 'ended',
    setCallStatus: (status: 'incoming' | 'outgoing' | 'none' | 'rejected' | 'accepted' | 'ended') => void
    callerId: string | null,
    setCallerId: (callerId: string) => void,
    calleeId: string | null,
    setCalleeId: (calleeId: string) => void
}

const useRtcStore = create<RtcState>((set) => ({
    iceServers: [],
    signalingServerSocketConnection: null,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    callStatus: 'none',
    callerId: null,
    calleeId: null,
    setCallerId: (callerId: string) => set(() => ({ callerId })),
    setCalleeId: (calleeId: string) => set(() => ({ calleeId })),
    setSignalingServerSocketConnection: (socket: Socket | null) => set((state) => {
        console.log('setSignalingServerSocketConnection', socket)
        if (state.signalingServerSocketConnection) {
            console.log('ALREADY CONNECTED TO SIGNALING SERVER')
            return { signalingServerSocketConnection: state.signalingServerSocketConnection }
        }
        return { signalingServerSocketConnection: socket }
    }),
    setIceServers: (iceServers: IceServer[]) => set(() => ({ iceServers })),
    setLocalStream: (stream: MediaStream) => set(() => ({ localStream: stream })),
    setRemoteStream: (stream: MediaStream) => set(() => ({ remoteStream: stream })),
    setPeerConnection: (peerConnection: RTCPeerConnection) => set(() => ({ peerConnection: peerConnection })),
    setCallStatus: (status: 'incoming' | 'outgoing' | 'none' | 'rejected' | 'accepted' | 'ended') => set(() => ({ callStatus: status }))
  }));

export default useRtcStore;