import React from 'react'
import { useStateCallback } from "./useStateCallback";
import { User } from "../types";
import { useSocket } from '../providers/SocketProvider';
import { ACTIONS } from '../constants/socket.actions';
import { iceServers } from '../constants/ice.servers';

export function useWebRTC(roomId: string | undefined, user: User | null) {

    const socket = useSocket();
    const [clients, setClients] = useStateCallback([]);
    const audioElements = React.useRef<any>({});
    const connections = React.useRef<any>({});
    const clientsRef = React.useRef<any>([]);
    const localMediaStream = React.useRef<MediaStream>();


    // add new clients
    const addNewClient = React.useCallback(async (newClient: any, cb: any) => {
        const lookingFor = clients.find((client: any) => client.id === newClient.id);
        if (!lookingFor) {
            setClients((prev: any) => [...prev, newClient], cb);
        }
    }, [clients, setClients]);


    // capture user media 
    React.useEffect(() => {
        const startCapture = async () => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        };
        startCapture().then(() => {
            addNewClient({ ...user, muted: true }, () => {
                const localElement = audioElements.current[user?.id!];
                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current;
                }
                socket?.emit(ACTIONS.JOIN, { roomId, user });
            });
        });

        return () => {
            localMediaStream.current?.getTracks().forEach((track: any) => track.stop());
            socket?.emit(ACTIONS.LEAVE, { roomId });
        }
    }, []);


    React.useEffect(() => {

        // handle new peer
        const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }: { peerId: string, createOffer: boolean, user: User }) => {

            // if already connected 
            if (peerId in audioElements.current) {
                return;
            }

            connections.current[peerId] = new RTCPeerConnection({ iceServers });

            // handle new ice candidate 
            connections.current[peerId].onicecandidate = (event: any) => {
                socket?.emit(ACTIONS.RELAY_ICE, { peerId, icecandidate: event.candidate });
            };

            // handle on track on this connection
            connections.current[peerId].ontrack = ({ streams: [remoteStream] }: { streams: any }) => {
                addNewClient({ ...remoteUser, muted: true }, () => {
                    if (remoteUser && remoteUser.id && audioElements.current[remoteUser.id]) {
                        audioElements.current[remoteUser.id].srcObject = remoteStream;
                    } else {
                        let settled = false;
                        const interval = setInterval(() => {
                            if (audioElements.current[remoteUser.id]) {
                                audioElements.current[remoteUser.id].srcObject = remoteStream;
                                settled = true;
                            }
                            if (settled) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    }
                });
            };

            // add local track to remote connections
            localMediaStream.current?.getTracks().forEach((track: any) => {
                connections.current[peerId].addTrack(track, localMediaStream.current);
            });

            // create offer
            if (createOffer) {
                const offer = await connections.current[peerId].createOffer();
                await connections.current[peerId].setLocalDescription(offer);
                // send offer to remote peer
                socket?.emit(ACTIONS.RELAY_SDP, { peerId, sessionDescription: offer });
            }

        };

        socket?.on(ACTIONS.ADD_PEER, handleNewPeer);

        return () => {
            socket?.off(ACTIONS.ADD_PEER);
        };
    }, []);


    // hanlde ice candidate
    React.useEffect(() => {
        socket?.on(ACTIONS.ICE_CANDIDATE, async ({ peerId, icecandidate }: any) => {
            if (icecandidate) {
                await connections.current[peerId].addIceCandidate(icecandidate);
            }
        });
        return () => {
            socket?.off(ACTIONS.ICE_CANDIDATE);
        };
    }, []);


    // handle SDP
    React.useEffect(() => {
        // hanlde remote SDP
        const handleRemoteSDP = async ({ peerId, sessionDescription: remoteSessionDescription }: any) => {
            await connections.current[peerId].setRemoteDescription(remoteSessionDescription);
            // if session description is type of offer then create an answer
            if (remoteSessionDescription.type === 'offer') {
                const answer = await connections.current[peerId].createAnswer();
                await connections.current[peerId].setLocalDescription(answer);
                socket?.emit(ACTIONS.RELAY_SDP, { peerId, sessionDescription: answer });
            }
        };
        socket?.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSDP);
        return () => {
            socket?.off(ACTIONS.SESSION_DESCRIPTION);
        };
    }, []);


    // handle remove peer
    React.useEffect(() => {

        const handleRemovePeer = async ({ peerId, userId }: any) => {
            if (connections.current[peerId]) {
                connections.current[peerId].close();
            }
            delete connections.current[peerId];
            delete audioElements.current[peerId];
            setClients((prev: any) => prev.filter((client: any) => client.id !== userId));
        };

        socket?.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket?.off(ACTIONS.REMOVE_PEER);
        }
    }, []);


    React.useEffect(() => {
        clientsRef.current = clients;
    }, [clients]);


    // listen for mute unmute
    React.useEffect(() => {

        socket?.on(ACTIONS.MUTE, ({ userId }: any) => {
            setMute(true, userId);
        });

        socket?.on(ACTIONS.UN_MUTE, ({ userId }: any) => {
            setMute(false, userId);
        });

        const setMute = (mute: boolean, userId: string) => {
            const clientIdx = clientsRef.current.map((client: any) => client.id).indexOf(userId);
            const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
            if (clientIdx > -1) {
                connectedClients[clientIdx].muted = mute;
                setClients(connectedClients);
            }
        };

    }, []);


    const provideRef = (instance: any, userId: string) => {
        audioElements.current[userId] = instance;
    };

    // handle mute
    const handleMute = (isMuted: boolean, userId: string) => {
        let settled = false;
        let interval = setInterval(() => {
            if (localMediaStream.current) {
                localMediaStream.current.getAudioTracks()[0].enabled = !isMuted;
                if (isMuted) {
                    socket?.emit(ACTIONS.MUTE, {
                        roomId,
                        userId,
                    });
                } else {
                    socket?.emit(ACTIONS.UN_MUTE, {
                        roomId,
                        userId,
                    });
                }
                settled = true;
            }
            if (settled) {
                clearInterval(interval);
            }
        }, 200);
    }

    return { clients, provideRef, handleMute };
};