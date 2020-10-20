const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

let messageList = [];
let userName = [];

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
  socket.on('login', (login) => {
    Id = socket.id;
    userName.push({Id, login});
    socket.broadcast.emit('login', login);
    }
  );
  socket.on('disconnect', (disconnect) => {
    userId = userName.find( user => user.Id == socket.id);
    userLoginName = userId.login;
    userIndex = userName.indexOf(userId);
    userName.splice(userIndex);
    socket.broadcast.emit('logout', userLoginName);
  });
});