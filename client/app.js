const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section'); 
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});

function login(){
  if(userNameInput.value){
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesList.classList.add('show');
    messagesSection.classList.add('show');
    socket.emit('login', userName);
  }else alert('Type login, Sir!');
}

addMessageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage(){
  if(!messageContentInput.value){
    alert('You Shoud Type a message');
  }else{
    addMessage(userName, messageContentInput.value);
    socket.emit('message', {author: userName, content: messageContentInput.value});
    messageContentInput.value = '';
  }
};

function addMessage(user, content){
  const message = document.createElement('li');
  message.className = 'message message--received';
  user === userName ? message.classList.add('message--self') : null;

  message.innerHTML = `
  <h3 class="message__author">${user === userName ? 'You' : user}</h3>
  <div class="message__content">${content}</div>
  `;

  messagesList.appendChild(message);
}

function botMessage(user, type){
  console.log(type)
  const message = document.createElement('li');
  message.className = 'message--bot';
  if( type === 'login'){
    message.innerHTML = `
    <h3 class="message__author">Bot Chat</h3>
    <div class="message__content">New Player arrived, say Hey to ${user}</div>`;
  }
  if( type === 'logout'){
    message.innerHTML = `
    <h3 class="message__author">Bot Chat</h3>
    <div class="message__content">${user} Disconected</div>`;
  }

  messagesList.appendChild(message);
};

// WEB SOCKET LISTENER
socket.on('message', ({author, content}) => addMessage(author, content));
socket.on('login', (user) => botMessage(user, 'login'));
socket.on('logout', (user) => botMessage(user, 'logout'));