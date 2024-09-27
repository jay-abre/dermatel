// src/components/Patients.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const Patients = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Patients
            </Typography>
            <Typography variant="body1">
                This is the Patients component.
            </Typography>
        </Container>
    );
};

export default Patients;