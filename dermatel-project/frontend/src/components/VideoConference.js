import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const VideoConference = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const appointmentId = queryParams.get('appointmentId');
    const roomId = `telemedicine-room-${appointmentId}`;
    const userVideo = useRef();

    useEffect(() => {
        // Initialize Jitsi API
        const domain = 'meet.jit.si';
        const options = {
            roomName: roomId,
            width: '100%',
            height: 500,
            parentNode: userVideo.current,
            configOverwrite: {
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startScreenSharing: true,
                enableEmailInStats: false
            },
            interfaceConfigOverwrite: {
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            },
            userInfo: {
                displayName: 'Your Name' // Replace with actual user name
            }
        };
        const api = new window.JitsiMeetExternalAPI(domain, options);

        return () => {
            api.dispose();
        };
    }, [roomId]);

    return (
        <div>
            <div ref={userVideo} style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default VideoConference;