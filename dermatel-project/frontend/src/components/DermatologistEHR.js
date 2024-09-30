import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Alert } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const DermatologistEHR = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    const fetchMedicalRecords = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/medical-records/dermatologists/medical-records`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setMedicalRecords(response.data);
        } catch (error) {
            console.error('Error fetching medical records', error);
            setError('Error fetching medical records');
        }
    };

    const handleDownload = (recordId) => {
        // Implement download logic here
        console.log(`Download record with ID: ${recordId}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Medical Records</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <List>
                    {medicalRecords.map((record) => (
                        <ListItem key={record.id} component={Paper} elevation={1} sx={{ mb: 1 }}>
                            <ListItemText
                                primary={`Patient Name: ${record.patientName}`}
                                secondary={`File Name: ${record.fileName}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="download" onClick={() => handleDownload(record.id)}>
                                    <DownloadIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default DermatologistEHR;