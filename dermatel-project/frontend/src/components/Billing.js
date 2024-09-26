import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Typography, List, ListItem, ListItemText,
    ListItemSecondaryAction, Paper, Box, Alert, Button
} from '@mui/material';

const Billing = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);

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
            const appointmentsWithStatus = await Promise.all(response.data.map(async (appointment) => {
                if (appointment.referenceNumber) {
                    const paymentStatus = await checkPaymentStatus(appointment.referenceNumber, appointment.id);
                    return { ...appointment, paymentStatus };
                }
                return appointment;
            }));
            setAppointments(appointmentsWithStatus);
        } catch (error) {
            console.error('Error fetching appointments', error);
        }
    };

    const checkPaymentStatus = async (referenceNumber, appointmentId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/payments/retrieve-link', {
                params: { referenceNumber },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            let status = response.data.data[0].attributes.status;
            if (status === 'paid') {
                status = 'COMPLETED';
            }
            await updatePaymentStatus(appointmentId, status);
            return status;
        } catch (error) {
            console.error('Error checking payment status', error);
            setError('Error checking payment status');
            return 'Unknown';
        }
    };

    const updatePaymentStatus = async (appointmentId, status) => {
        try {
            await axios.put(`http://localhost:8080/api/appointments/${appointmentId}/payment-status`, null, {
                params: { paymentStatus: status },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
        } catch (error) {
            console.error('Error updating payment status', error);
            setError('Error updating payment status');
        }
    };

    const createPaymentLink = async (appointmentId) => {
        try {
            const paymentResponse = await axios.post('http://localhost:8080/api/payments/create-link', null, {
                params: {
                    amount: 50000, // Example amount
                    description: `Payment for appointment ${appointmentId}`
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const paymentData = paymentResponse.data;
            console.log('Payment link created:', paymentData);

            const referenceNumber = paymentData?.data?.attributes?.reference_number;
            const paymentLink = paymentData?.data?.attributes?.checkout_url;
            if (!referenceNumber) {
                throw new Error('Reference number is missing in the payment data');
            }

            await axios.put(`http://localhost:8080/api/appointments/${appointmentId}/reference-number`, null, {
                params: {
                    referenceNumber: referenceNumber,
                    paymentLink: paymentLink
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            setAppointments(prevAppointments => prevAppointments.map(appointment =>
                appointment.id === appointmentId ? { ...appointment, paymentLink } : appointment
            ));

            fetchAppointments();
        } catch (error) {
            console.error('Error creating payment link', error);
            setError('Error creating payment link');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Billing</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <List>
                {appointments.map((appointment) => (
                    <ListItem key={appointment.id} component={Paper} elevation={1} sx={{ mb: 1 }}>
                        <ListItemText
                            primary={`Appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                            secondary={`with Dr. ${appointment.doctorName} - Payment Status: ${appointment.paymentStatus || 'N/A'}`}
                        />
                        <ListItemSecondaryAction>
                            {appointment.paymentLink ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href={appointment.paymentLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Pay Here
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => createPaymentLink(appointment.id)}
                                >
                                    Create Payment Link
                                </Button>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Billing;