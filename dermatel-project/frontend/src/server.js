// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    path: '/ws/socket.io',
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', ({ roomId }) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', { userId: socket.id });
    });

    socket.on('signal', ({ to, from, signal }) => {
        io.to(to).emit('signal', { from, signal });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(8081, () => console.log('Server is running on port 8081'));