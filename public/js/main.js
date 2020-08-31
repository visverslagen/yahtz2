const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const throwButton = document.getElementById('throw');
const startButton = document.getElementById('start');
const turnButton = document.getElementById('turn');

const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const dice3 = document.getElementById('dice3');
const dice4 = document.getElementById('dice4');
const dice5 = document.getElementById('dice5');

const choice_1 = document.getElementById('choice_1');
const choice_2 = document.getElementById('choice_2');
const choice_3 = document.getElementById('choice_3');
const choice_4 = document.getElementById('choice_4');
const choice_5 = document.getElementById('choice_5');
const choice_6 = document.getElementById('choice_6');
//const choice_3ofakind = document.getElementById('choice_3ofakind');


// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users, html }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('error', msg => {
    alert(msg);
});

socket.on('game-data', data => {
    if(data.onesDone){
        choice_1.classList.add("inactive");
        document.querySelector("#onesScore").innerHTML = data.ones;
    }
    if(data.twosDone){
        choice_2.classList.add("inactive");
        document.querySelector("#twosScore").innerHTML = data.twos;
    }
    if(data.threesDone){
        choice_3.classList.add("inactive");
        document.querySelector("#threesScore").innerHTML = data.threes;
    }
    if(data.foursDone){
        choice_4.classList.add("inactive");
        document.querySelector("#foursScore").innerHTML = data.fours;
    }
    if(data.fivesDone){
        choice_5.classList.add("inactive");
        document.querySelector("#fivesScore").innerHTML = data.fives;
    }
    if(data.sixesDone){
        choice_6.classList.add("inactive");
        document.querySelector("#sixesScore").innerHTML = data.sixes;
    }
    if(data.total > 0){
        document.querySelector("#totalScore").innerHTML = data.total;
    }
});

socket.on('start', data => {
    document.querySelector("#game").classList.remove("inactive");
});
socket.on('game', data => {
    var i;
    for (i = 0; i < data.dices.length; i++) {
      document.querySelector("#dice"+[(i+1)]).value = data.dices[i];
    }
    if(data.roll == 3){
        document.querySelector("#throw").classList.add("inactive");
    }
    document.querySelector("#roll").innerHTML = data.roll+'/3';
});

socket.on('not_your_turn', message => {
  document.querySelector("#throw").classList.add("inactive");
  //document.querySelector("#turn").classList.add("inactive");
  document.querySelector("#choices").classList.add("inactive");

  document.querySelector("#start").classList.add("inactive");

  document.querySelector("#roll").innerHTML = '0/3';
  var i;
  for (i = 0; i < 5; i++) {
    document.querySelector("#dice"+[(i+1)]).value = "";
    document.querySelector("#dice"+[(i+1)]).style.border = "1px solid #ccc";
  }
});

// Message from server
socket.on('your_turn', message => {
  //document.querySelector("#turn").classList.remove("inactive");
  document.querySelector("#choices").classList.remove("inactive");

  document.querySelector("#start").classList.add("inactive");
  document.querySelector("#throw").classList.remove("inactive");
  document.querySelector("#roll").innerHTML = '0/3';

  var i;
  for (i = 0; i < 5; i++) {
    document.querySelector("#dice"+[(i+1)]).value = "";
    document.querySelector("#dice"+[(i+1)]).style.border = "1px solid #ccc";
    document.querySelector("#dice"+[(i+1)]).classList.remove("selected");
  }
});

dice1.addEventListener('click', function(e) {
    if(dice1.classList.contains("selected")){
        dice1.classList.remove("selected");
        dice1.style.border = "1px solid #ccc";
    }else{
        dice1.classList.add("selected");
        dice1.style.border = "thick solid #667AFF";
    }
});

dice2.addEventListener('click', function(e) {
    if(dice2.classList.contains("selected")){
        dice2.classList.remove("selected");
        dice2.style.border = "1px solid #ccc";
    }else{
        dice2.classList.add("selected");
        dice2.style.border = "thick solid #667AFF";
    }
});

dice3.addEventListener('click', function(e) {
    if(dice3.classList.contains("selected")){
        dice3.classList.remove("selected");
        dice3.style.border = "1px solid #ccc";
    }else{
        dice3.classList.add("selected");
        dice3.style.border = "thick solid #667AFF";
    }
});

dice4.addEventListener('click', function(e) {
    if(dice4.classList.contains("selected")){
        dice4.classList.remove("selected");
        dice4.style.border = "1px solid #ccc";
    }else{
        dice4.classList.add("selected");
        dice4.style.border = "thick solid #667AFF";
    }
});

dice5.addEventListener('click', function(e) {
    if(dice5.classList.contains("selected")){
        dice5.classList.remove("selected");
        dice5.style.border = "1px solid #ccc";
    }else{
        dice5.classList.add("selected");
        dice5.style.border = "thick solid #667AFF";
    }
});

startButton.addEventListener('click', function(e) {
    socket.emit('start');
});

choice_1.addEventListener('click', function(e) {
    var result = [];
    var i;
    for (i = 0; i < 5; i++) {
        result.push([(i+1), document.querySelector("#dice"+[(i+1)]).value]);
    }
    socket.emit('choice', '1');
});

choice_2.addEventListener('click', function(e) {
    var result = [];
    var i;
    for (i = 0; i < 5; i++) {
        result.push([(i+1), document.querySelector("#dice"+[(i+1)]).value]);
    }
    socket.emit('choice', '2');
});

choice_3.addEventListener('click', function(e) {
    var result = [];
    var i;
    for (i = 0; i < 5; i++) {
        result.push([(i+1), document.querySelector("#dice"+[(i+1)]).value]);
    }
    socket.emit('choice', '3');
});

choice_4.addEventListener('click', function(e) {
    var result = [];
    var i;
    for (i = 0; i < 5; i++) {
        result.push([(i+1), document.querySelector("#dice"+[(i+1)]).value]);
    }
    socket.emit('choice', '4');
});

choice_5.addEventListener('click', function(e) {
    var result = [];
    var i;
    for (i = 0; i < 5; i++) {
        result.push([(i+1), document.querySelector("#dice"+[(i+1)]).value]);
    }
    socket.emit('choice', '5');
});

choice_6.addEventListener('click', function(e) {
    var result = [];
    var i;
    for (i = 0; i < 5; i++) {
        result.push([(i+1), document.querySelector("#dice"+[(i+1)]).value]);
    }
    socket.emit('choice', '6');
});

// choice_3ofakind.addEventListener('click', function(e) {
//     socket.emit('choice_3ofakind', e);
// });

// turnButton.addEventListener('click', function(e) {
//     var result = [];
//     var i;
//     for (i = 0; i < 5; i++) {
//         result.push([(i+1), document.querySelector("#dice"+[(i+1)]).value]);
//     }
//
//     socket.emit('pass_turn', result);
// });

throwButton.addEventListener('click', function(e) {
    var keep = [];
    var i;
    for (i = 0; i < 5; i++) {
     if(document.querySelector("#dice"+[(i+1)]).classList.contains("selected")){
        keep.push([(i+1), document.querySelector("#dice"+[(i+1)]).value]);
     }
    }
    socket.emit('roll_dice', keep);
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"><span>${message.time}</span> ${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
