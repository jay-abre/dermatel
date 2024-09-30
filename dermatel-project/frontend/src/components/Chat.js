import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { Container, TextField, Button, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [patientId, setPatientId] = useState(null);

    useEffect(() => {
        const fetchPatientId = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user-id`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setPatientId(response.data);
            } catch (error) {
                console.error('Error fetching patient ID:', error);
            }
        };

        fetchPatientId();
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (selectedDoctor && patientId) {
            const q = query(
                collection(db, 'messages'),
                where('doctorId', '==', selectedDoctor),
                where('patientId', '==', patientId),
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
    }, [selectedDoctor, patientId]);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dermatologists`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors', error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !selectedDoctor) return;

        await addDoc(collection(db, 'messages'), {
            text: newMessage,
            doctorId: selectedDoctor,
            patientId: patientId,
            timestamp: new Date()
        });

        setNewMessage('');
    };

    return (
        <Container>
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="select-doctor-label">Select Doctor</InputLabel>
                <Select
                    labelId="select-doctor-label"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    label="Select Doctor"
                >
                    {doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
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

export default Chat;