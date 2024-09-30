import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, List, ListItem, ListItemText,
    ListItemSecondaryAction, IconButton, Paper, Box, Alert
} from '@mui/material';
import { VideoCall as VideoCallIcon } from '@mui/icons-material';

const DermatologistAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dermatologists/dashboard`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments', error);
            setError('Error fetching appointments');
        }
    };

    const handleJoinVideoCall = (appointmentId) => {
        navigate(`/dermatologist-dashboard/videocalls?appointmentId=${appointmentId}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Appointments</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <List>
                    {appointments.map((appointment) => (
                        <ListItem key={appointment.id} component={Paper} elevation={1} sx={{ mb: 1 }}>
                            <ListItemText
                                primary={`Appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                                secondary={`with Dr. ${appointment.doctorName}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="video call" onClick={() => handleJoinVideoCall(appointment.id)}>
                                    <VideoCallIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default DermatologistAppointments;