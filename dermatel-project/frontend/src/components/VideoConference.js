import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Button, IconButton } from '@mui/material';
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
        socketRef.current = io.connect('http://localhost:8080');
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;

            socketRef.current.emit('join', roomId);

            socketRef.current.on('user-joined', userId => {
                const peer = createPeer(userId, socketRef.current.id, stream);
                peersRef.current.push({
                    peerID: userId,
                    peer,
                });
                setPeers(peers => [...peers, peer]);
            });

            socketRef.current.on('signal', data => {
                const item = peersRef.current.find(p => p.peerID === data.from);
                item.peer.signal(data.signal);
            });

            socketRef.current.on('user-left', userId => {
                const peerObj = peersRef.current.find(p => p.peerID === userId);
                if (peerObj) {
                    peerObj.peer.destroy();
                }
                const peers = peersRef.current.filter(p => p.peerID !== userId);
                peersRef.current = peers;
                setPeers(peers.map(p => p.peer));
            });
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
                socketRef.current.emit('signal', { to: userToSignal, from: callerID, signal: event.candidate });
            }
        };

        peer.ontrack = (event) => {
            const remoteVideo = document.createElement('video');
            remoteVideo.srcObject = event.streams[0];
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            document.getElementById('remoteVideos').appendChild(remoteVideo);
        };

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        return peer;
    }

    const handleEndCall = () => {
        // Close all peer connections
        peersRef.current.forEach(peerObj => peerObj.peer.destroy());
        peersRef.current = [];
        setPeers([]);

        // Stop all media tracks
        userVideo.current.srcObject.getTracks().forEach(track => track.stop());

        // Disconnect from the signaling server
        socketRef.current.disconnect();
    };

    const handleMute = () => {
        const enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
        userVideo.current.srcObject.getAudioTracks()[0].enabled = !enabled;
        setMuted(!enabled);
    };

    const handleCamera = () => {
        const videoTrack = userVideo.current.srcObject.getVideoTracks()[0];
        if (videoTrack.enabled) {
            videoTrack.enabled = false;
        } else {
            videoTrack.enabled = true;
        }
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