import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText, Alert, IconButton } from '@mui/material';
import { Delete, Download } from '@mui/icons-material';

const EHR = ({ userId }) => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    const fetchMedicalRecords = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/medical-records/user', {
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadMedicalRecord = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/medical-records/upload', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMedicalRecords([...medicalRecords, response.data]);
            setFile(null);
        } catch (error) {
            console.error('Error uploading medical record', error);
            setError('Error uploading medical record');
        }
    };

    const downloadMedicalRecord = async (id, fileName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/medical-records/download/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading medical record', error);
            setError('Error downloading medical record');
        }
    };

    const deleteMedicalRecord = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/medical-records/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setMedicalRecords(medicalRecords.filter(record => record.id !== id));
        } catch (error) {
            console.error('Error deleting medical record', error);
            setError('Error deleting medical record');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Electronic Health Records</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="primary" onClick={uploadMedicalRecord}>
                Upload Medical Record
            </Button>
            <List>
                {medicalRecords.map((record) => (
                    <ListItem key={record.id}>
                        <ListItemText primary={record.fileName} secondary={`Uploaded on: ${new Date(record.uploadDate).toLocaleDateString()}`} />
                        <IconButton onClick={() => downloadMedicalRecord(record.id, record.fileName)}>
                            <Download />
                        </IconButton>
                        <IconButton onClick={() => deleteMedicalRecord(record.id)}>
                            <Delete />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default EHR;