import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper, Alert } from '@mui/material';

const DermatologistBilling = () => {
    const [billingInfo, setBillingInfo] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBillingInfo();
    }, []);

    const fetchBillingInfo = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/appointments/dermatologist/payment-status', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setBillingInfo(response.data);
        } catch (error) {
            console.error('Error fetching billing information', error);
            setError('Error fetching billing information');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Billing Information</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <List>
                    {billingInfo.map((info, index) => (
                        <ListItem key={index} component={Paper} elevation={1} sx={{ mb: 1 }}>
                            <ListItemText
                                primary={`Patient Name: ${info.patientName}`}
                                secondary={`Payment Status: ${info.paymentStatus} - Reference Number: ${info.referenceNumber || 'N/A'}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default DermatologistBilling;