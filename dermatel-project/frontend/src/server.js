const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('signal', (data) => {
        io.to(data.to).emit('signal', { from: data.from, signal: data.signal });
    });

    socket.on('disconnect', () => {
        io.emit('user-left', socket.id);
    });
});

server.listen(8080, () => console.log('Server is running on port 8080'));