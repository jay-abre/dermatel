// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Container, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messages);
        });

        return () => unsubscribe();
    }, []);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        await addDoc(collection(db, 'messages'), {
            text: newMessage,
            timestamp: new Date()
        });

        setNewMessage('');
    };

    return (
        <Container>
            <List>
                {messages.map((message) => (
                    <ListItem key={message.id}>
                        <ListItemText primary={message.text} secondary={new Date(message.timestamp.toDate()).toLocaleString()} />
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