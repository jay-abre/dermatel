import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { Container, TextField, Button, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const DermatologistChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [doctorId, setDoctorId] = useState(null);

    useEffect(() => {
        const fetchDoctorId = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/user-id', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setDoctorId(response.data);
            } catch (error) {
                console.error('Error fetching doctor ID:', error);
            }
        };

        fetchDoctorId();
        fetchPatients();
    }, []);

    useEffect(() => {
        if (selectedPatient && doctorId) {
            const q = query(
                collection(db, 'messages'),
                where('patientId', '==', selectedPatient),
                where('doctorId', '==', doctorId),
                orderBy('timestamp', 'asc')
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messages = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('Received messages:', messages);
                setMessages(messages);
            }, (error) => {
                console.error('Error fetching messages:', error);
            });

            return () => unsubscribe();
        }
    }, [selectedPatient, doctorId]);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/appointments/dermatologist/patients', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients', error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !selectedPatient) return;

        await addDoc(collection(db, 'messages'), {
            text: newMessage,
            patientId: selectedPatient,
            doctorId: doctorId,
            timestamp: new Date()
        });

        setNewMessage('');
    };

    return (
        <Container>
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="select-patient-label">Select Patient</InputLabel>
                <Select
                    labelId="select-patient-label"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    label="Select Patient"
                >
                    {patients.map((patient) => (
                        <MenuItem key={patient.userId} value={patient.userId}>
                            {patient.fullName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <List>
                {messages.map((message) => (
                    <ListItem key={message.id}>
                        <ListItemText
                            primary={message.text}
                            secondary={new Date(message.timestamp.toDate()).toLocaleString()}
                        />
                    </ListItem>
                ))}
            </List>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
            </Button>
        </Container>
    );
};

export default DermatologistChat;