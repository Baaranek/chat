const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

let messageList = [];

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8080, () => {
  console.log('Server is running on port: 8080');
});

//Socket Io Listeners
const io = socket(server);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    messageList.push(message);
    socket.broadcast.emit('message', message);
  });
})