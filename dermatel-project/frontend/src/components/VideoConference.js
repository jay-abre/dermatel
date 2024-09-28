import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { IconButton } from '@mui/material';
import { CallEnd, MicOff, Mic, VideocamOff, Videocam } from '@mui/icons-material';

const VideoConference = () => {
    const [peers, setPeers] = useState([]);
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const appointmentId = queryParams.get('appointmentId');
    const roomId = `telemedicine-room-${appointmentId}`;

    useEffect(() => {
        socketRef.current = io('http://localhost:8081', {
            path: '/ws/socket.io',
            extraHeaders: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;

            socketRef.current.emit('join', { roomId });
            console.log(`Joined room: ${roomId}`);

            socketRef.current.on('user-joined', ({ userId }) => {
                console.log(`User joined: ${userId}`);
                const peer = createPeer(userId, socketRef.current.id, stream);
                peersRef.current.push({
                    peerID: userId,
                    peer,
                });
                setPeers(peers => [...peers, peer]);
            });

            socketRef.current.on('signal', ({ from, signal }) => {
                console.log(`Signal received from: ${from}`, signal);
                const item = peersRef.current.find(p => p.peerID === from);
                if (item) {
                    item.peer.signal(signal);
                } else {
                    console.error('Peer not found for signal:', from);
                }
            });

            socketRef.current.on('user-left', ({ userId }) => {
                console.log(`User left: ${userId}`);
                const peerObj = peersRef.current.find(p => p.peerID === userId);
                if (peerObj) {
                    peerObj.peer.destroy();
                }
                const peers = peersRef.current.filter(p => p.peerID !== userId);
                peersRef.current = peers;
                setPeers(peers.map(p => p.peer));
            });
        }).catch(error => {
            console.error('Error accessing media devices.', error);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
            ]
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate:', event.candidate);
                socketRef.current.emit('signal', { to: userToSignal, from: callerID, signal: event.candidate });
            }
        };

        peer.ontrack = (event) => {
            console.log('Track event received:', event);
            const remoteVideo = document.createElement('video');
            remoteVideo.srcObject = event.streams[0];
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            remoteVideo.style.width = '300px'; // Adjust the width as needed
            const remoteVideos = document.getElementById('remoteVideos');
            if (remoteVideos) {
                remoteVideos.appendChild(remoteVideo);
                console.log('Remote video appended');
            } else {
                console.error('Remote videos container not found');
            }
        };

        peer.onconnectionstatechange = () => {
            console.log('Peer connection state:', peer.connectionState);
            if (peer.connectionState === 'failed' || peer.connectionState === 'disconnected') {
                console.error('Peer connection failed or disconnected');
            }
        };

        peer.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', peer.iceConnectionState);
            if (peer.iceConnectionState === 'failed') {
                console.error('ICE connection failed');
            }
        };

        stream.getTracks().forEach(track => {
            console.log('Adding track:', track);
            peer.addTrack(track, stream);
        });

        return peer;
    }

    const handleEndCall = () => {
        peersRef.current.forEach(peerObj => peerObj.peer.destroy());
        peersRef.current = [];
        setPeers([]);
        userVideo.current.srcObject.getTracks().forEach(track => track.stop());
        socketRef.current.disconnect();
    };

    const handleMute = () => {
        const enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
        userVideo.current.srcObject.getAudioTracks()[0].enabled = !enabled;
        setMuted(!enabled);
    };

    const handleCamera = () => {
        const videoTrack = userVideo.current.srcObject.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOff(!videoTrack.enabled);
    };

    return (
        <div>
            <video ref={userVideo} autoPlay playsInline style={{ width: '300px' }} />
            <div id="remoteVideos" style={{ display: 'flex', flexWrap: 'wrap' }}></div>
            <div style={{ marginTop: '10px' }}>
                <IconButton onClick={handleEndCall} color="secondary">
                    <CallEnd />
                </IconButton>
                <IconButton onClick={handleMute} color="primary">
                    {muted ? <MicOff /> : <Mic />}
                </IconButton>
                <IconButton onClick={handleCamera} color="primary">
                    {cameraOff ? <VideocamOff /> : <Videocam />}
                </IconButton>
            </div>
        </div>
    );
};

export default VideoConference;