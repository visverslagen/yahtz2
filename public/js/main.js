const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const scoreboard = document.getElementById('scoreboard');
const visual_dices = document.getElementById('visual_dices');

const throwButton = document.getElementById('throw');
const startButton = document.getElementById('start');
const turnButton = document.getElementById('turn');

const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const dice3 = document.getElementById('dice3');
const dice4 = document.getElementById('dice4');
const dice5 = document.getElementById('dice5');

const vdice1 = document.getElementById('vdice1');
const vdice2 = document.getElementById('vdice2');
const vdice3 = document.getElementById('vdice3');
const vdice4 = document.getElementById('vdice4');
const vdice5 = document.getElementById('vdice5');

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
  outputScores(users);
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
    outputScores(data);
});

socket.on('button-data', data => {


    if(data.onesDone){
        choice_1.classList.add("inactive");
    }else{
        choice_1.classList.remove("inactive");
    }
    if(data.twosDone){
        choice_2.classList.add("inactive");
    }else{
        choice_2.classList.remove("inactive");
    }
    if(data.threesDone){
        choice_3.classList.add("inactive");
    }else{
        choice_3.classList.remove("inactive");
    }
    if(data.foursDone){
        choice_4.classList.add("inactive");
    }else{
        choice_4.classList.remove("inactive");
    }
    if(data.fivesDone){
        choice_5.classList.add("inactive");
    }else{
        choice_5.classList.remove("inactive");
    }
    if(data.sixesDone){
        choice_6.classList.add("inactive");
    }else{
        choice_6.classList.remove("inactive");
    }
});

socket.on('start', data => {
    document.querySelector("#game").classList.remove("inactive");
});
socket.on('game', data => {
    //var visual_html = '';
    var i;
    for (i = 0; i < data.dices.length; i++) {
      document.querySelector("#dice"+[(i+1)]).value = data.dices[i];

      if(data.dices[i] == 1){ var temp_html = '<div class="first-face" id="vdicenr'+(i+1)+'" data-nr="1"> <span class="pip"></span> </div>'; }
      if(data.dices[i] == 2){ var temp_html = '<div class="second-face" id="vdicenr'+(i+1)+'" data-nr="2"> <span class="pip"></span> <span class="pip"></span> </div>'; }
      if(data.dices[i] == 3){ var temp_html = '<div class="third-face" id="vdicenr'+(i+1)+'" data-nr="3"> <span class="pip"></span> <span class="pip"></span> <span class="pip"></span> </div>'; }
      if(data.dices[i] == 4){ var temp_html = '<div class="fourth-face" id="vdicenr'+(i+1)+'" data-nr="4"> <div class="column"> <span class="pip"></span> <span class="pip"></span> </div><div class="column"> <span class="pip"></span> <span class="pip"></span> </div></div>'; }
      if(data.dices[i] == 5){ var temp_html = '<div class="fifth-face" id="vdicenr'+(i+1)+'" data-nr="5"> <div class="column"> <span class="pip"></span> <span class="pip"></span> </div><div class="column"> <span class="pip"></span> </div><div class="column"> <span class="pip"></span> <span class="pip"></span> </div></div>'; }
      if(data.dices[i] == 6){ var temp_html = '<div class="sixth-face" id="vdicenr'+(i+1)+'" data-nr="6"> <div class="column"> <span class="pip"></span> <span class="pip"></span> <span class="pip"></span> </div><div class="column"> <span class="pip"></span> <span class="pip"></span> <span class="pip"></span> </div></div>'; }

      document.querySelector("#vdice"+[(i+1)]).innerHTML = temp_html;
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

    document.querySelector("#vdice"+[(i+1)]).innerHTML = "";
    document.querySelector("#vdice"+[(i+1)]).classList.remove("selected");
  }
});

vdice1.addEventListener('click', function(e) {
    if(vdice1.classList.contains("selected")){
        vdice1.classList.remove("selected");
        //vdice1.style.border = "1px solid #ccc";
    }else{
        vdice1.classList.add("selected");
        //vdice1.style.border = "thick solid #667AFF";
    }
});

vdice2.addEventListener('click', function(e) {
    if(vdice2.classList.contains("selected")){
        vdice2.classList.remove("selected");
        //vdice2.style.border = "1px solid #ccc";
    }else{
        vdice2.classList.add("selected");
        //vdice2.style.border = "thick solid #667AFF";
    }
});

vdice3.addEventListener('click', function(e) {
    if(vdice3.classList.contains("selected")){
        vdice3.classList.remove("selected");
        //vdice3.style.border = "1px solid #ccc";
    }else{
        vdice3.classList.add("selected");
        //vdice3.style.border = "thick solid #667AFF";
    }
});

vdice4.addEventListener('click', function(e) {
    if(vdice4.classList.contains("selected")){
        vdice4.classList.remove("selected");
        //vdice4.style.border = "1px solid #ccc";
    }else{
        vdice4.classList.add("selected");
        //vdice4.style.border = "thick solid #667AFF";
    }
});

vdice5.addEventListener('click', function(e) {
    if(vdice5.classList.contains("selected")){
        vdice5.classList.remove("selected");
        //vdice5.style.border = "1px solid #ccc";
    }else{
        vdice5.classList.add("selected");
        //vdice5.style.border = "thick solid #667AFF";
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
     if(document.querySelector("#vdice"+[(i+1)]).classList.contains("selected")){
        keep.push([(i+1), document.querySelector("#vdicenr"+(i+1)).getAttribute('data-nr')]);
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

function outputScores(users) {
  scoreboard.innerHTML = '<table id="yahtzeeTable" style="width:100px; float:left"><tr><th>&nbsp;</th></tr><tr><td id="ones" class="cell">1</td></tr><tr><td id="twos" class="cell">2</td></tr><tr><td id="threes" class="cell">3</td></tr><tr><td id="fours" class="cell">4</td></tr><tr><td id="fives" class="cell">5</td></tr><tr><td id="sixes" class="cell">6</td></tr><tr><td id="upperSecBonus">Bonus</td></tr><tr><td id="total" class="cell"><b>Score</b></td></tr></table>';
  scoreboard.innerHTML = scoreboard.innerHTML + `
    ${users.map(user => `<table id="yahtzeeTable2" style="width:70px; float:left"> <tr> <th>${user.username}</th> </tr><tr> <td id="onesScore">${user.ones}</td></tr><tr> <td id="twosScore">${user.twos}</td></tr><tr> <td id="threesScore">${user.threes}</td></tr><tr> <td id="foursScore">${user.fours}</td></tr><tr> <td id="fivesScore">${user.fives}</td></tr><tr> <td id="sixesScore">${user.sixes}</td></tr><tr> <td id="upperSecBonusScore">-</td></tr><tr> <td id="totalScore">${user.total}</td></tr></table>`).join('')}
  `;
}
