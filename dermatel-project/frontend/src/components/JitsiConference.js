import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const JitsiConference = ({ roomName, displayName }) => {
    return (
        <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startScreenSharing: true,
                enableEmailInStats: false
            }}
            interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            }}
            userInfo={{
                displayName: displayName
            }}
            onApiReady={(externalApi) => {
                // Attach custom event listeners to the Jitsi Meet External API
            }}
            getIFrameRef={(iframeRef) => { iframeRef.style.height = '500px'; }}
        />
    );
};

export default JitsiConference;