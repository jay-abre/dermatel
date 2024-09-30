import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper, Alert } from '@mui/material';

const DermatologistPatients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/appointments/dermatologist/patients`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients', error);
            setError('Error fetching patients');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Patients</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <List>
                    {patients.map((patient) => (
                        <ListItem key={patient.userId} component={Paper} elevation={1} sx={{ mb: 1 }}>
                            <ListItemText
                                primary={`Name: ${patient.fullName}`}
                                secondary={`Address: ${patient.address} - Phone: ${patient.phoneNumber} - DOB: ${patient.dateOfBirth}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default DermatologistPatients;