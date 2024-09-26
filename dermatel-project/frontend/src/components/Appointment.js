import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, List, ListItem, ListItemText,
    ListItemSecondaryAction, IconButton, Paper, Box
} from '@mui/material';
import { Edit as EditIcon, VideoCall as VideoCallIcon } from '@mui/icons-material';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [formData, setFormData] = useState({
        appointmentDate: '',
        appointmentTime: '',
        doctorName: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/appointments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}:00`);
            const formattedData = {
                ...formData,
                appointmentDate: appointmentDateTime.toISOString() // Convert to ISO string
            };
            if (selectedAppointment) {
                await axios.put(`http://localhost:8080/api/appointments/${selectedAppointment.id}`, formattedData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
            } else {
                await axios.post('http://localhost:8080/api/appointments', formattedData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
            }
            fetchAppointments();
            setFormData({ appointmentDate: '', appointmentTime: '', doctorName: '' });
            setSelectedAppointment(null);
        } catch (error) {
            console.error('Error saving appointment', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const handleEdit = (appointment) => {
        const [date, time] = appointment.appointmentDate.split('T');
        setSelectedAppointment(appointment);
        setFormData({
            appointmentDate: date,
            appointmentTime: time.substring(0, 5), // Extract HH:mm
            doctorName: appointment.doctorName
        });
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/appointments/my-appointment/${selectedAppointment.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            fetchAppointments();
            setSelectedAppointment(null);
            setFormData({ appointmentDate: '', appointmentTime: '', doctorName: '' });
        } catch (error) {
            console.error('Error deleting appointment', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request data:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const handleJoinVideoCall = (appointmentId) => {
        navigate(`/dashboard/videocalls?appointmentId=${appointmentId}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Appointments</Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Date"
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleInputChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Time"
                            type="time"
                            name="appointmentTime"
                            value={formData.appointmentTime}
                            onChange={handleInputChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Doctor Name"
                            name="doctorName"
                            value={formData.doctorName}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {selectedAppointment ? 'Update' : 'Create'} Appointment
                    </Button>
                </form>
                {selectedAppointment && (
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Delete My Appointment
                    </Button>
                )}
            </Paper>
            <List>
                {appointments.map((appointment) => (
                    <ListItem key={appointment.id} component={Paper} elevation={1} sx={{ mb: 1 }}>
                        <ListItemText
                            primary={`Appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                            secondary={`with Dr. ${appointment.doctorName}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(appointment)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="video call" onClick={() => handleJoinVideoCall(appointment.id)}>
                                <VideoCallIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Appointments;