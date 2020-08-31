const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'Yahtzee';

// game defaults
var players = [];
var current_turn = 0;
var _turn = 0;
var _rolls = 0;

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room,
        ones= 0,
        onesDone= false,
        twos= 0,
        twosDone= false,
        threes= 0,
        threesDone= false,
        fours= 0,
        foursDone= false,
        fives= 0,
        fivesDone= false,
        sixes= 0,
        sixesDone= false,
        bonus= 0,
        threeOfAKind= 0,
        threeOfAKindDone= false,
        fourOfAKind= 0,
        fourOfAKindDone= false,
        smallStraight= 0,
        smallStraightDone= false,
        largeStraight= 0,
        largeStraightDone= false,
        fullHouse= 0,
        fullHouseDone= false,
        chance= 0,
        chanceDone= false,
        yatzy= 0,
        yatzyDone= false,
        rolls = 0
    );

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welkom bij Yahtzee!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} speelt nu ook mee`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

    players.push(socket);
  });

  socket.on('start',function(){
     // alleen de eerste speler kan het spel starten!
     if(players[_turn] == socket){
        _turn = current_turn++ % players.length;
        const user = getCurrentUser(socket.id);
        io.in(user.room).emit('message', formatMessage(botName, `spel is gestart`));

        io.in(user.room).emit('start', 'test');
        io.to(user.room).emit('not_your_turn', 'test');

        // naar volgende speler bericht sturen
        var next_player = (current_turn+1);
        io.to(players[next_player++ % players.length].id).emit('your_turn', 'test');
     }
 });

 //  socket.on('pass_turn', result => {
 //
 //     // alleen als deze speler aan de beurt is!
 //     if(players[_turn] == socket){
 //
 //        //console.log(result[1]);
 //
 //        _turn = current_turn++ % players.length;
 //        const user = getCurrentUser(socket.id);
 //
 //        io.to(user.room).emit('not_your_turn', 'test');
 //
 //        // naar volgende speler bericht sturen
 //        var next_player = (current_turn+1);
 //        io.to(players[next_player++ % players.length].id).emit('your_turn', 'test');
 //
 //        var i;
 //        var result_html = "";
 //        for (i = 0; i < result[0].length; i++) {
 //          result_html = result_html + result[0][i][1]+" ";
 //        }
 //        io.in(user.room).emit('message', formatMessage(user.username, result_html+' gegooid'));
 //
 //        _rolls = 0;
 //        user.rolls = 0;
 //     }
 // });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('roll_dice', keep => {

    const user = getCurrentUser(socket.id);

    var diceRoll1 = Math.floor( Math.random() * 6 ) +1;
    var diceRoll2 = Math.floor( Math.random() * 6 ) +1;
    var diceRoll3 = Math.floor( Math.random() * 6 ) +1;
    var diceRoll4 = Math.floor( Math.random() * 6 ) +1;
    var diceRoll5 = Math.floor( Math.random() * 6 ) +1;

    var _dices = [diceRoll1, diceRoll2, diceRoll3, diceRoll4, diceRoll5];

    // overwrite dices with keep values
    var i;
    for (i = 0; i < keep.length; i++) {
      _dices[(keep[i][0]-1)] = keep[i][1];
    }

    _rolls++;

    user.dices = _dices;
    user.rolls = _rolls;

    // naar iedereen
    io.in(user.room).emit('game', {
      dices: _dices,
      roll: _rolls,
    });

    if(_rolls == 3){
        _rolls = 0;
    }

    //console.log(user);

  });

  socket.on('choice', nr => {
      const user = getCurrentUser(socket.id);

      // Throw error!
      if((nr == 1 && user.onesDone) ||
         (nr == 2 && user.twosDone) ||
         (nr == 3 && user.threesDone) ||
         (nr == 4 && user.foursDone) ||
         (nr == 5 && user.fivesDone) ||
         (nr == 6 && user.sixesDone)){
          io.to(socket.id).emit('error', 'Dit veld is al een keer gekozen');
      }else{

          var count = 0;
          var i;
          for (i = 0; i < user.dices.length; i++) {
            if(user.dices[i] == nr){
                count++;
            }
          }

          if(nr == 1){
            user.onesDone = true;
            user.ones = count;
          }else if(nr == 2){
              user.twosDone = true;
              user.twos = count*nr;
          }else if(nr == 3){
              user.threesDone = true;
              user.threes = count*nr;
          }else if(nr == 4){
              user.foursDone = true;
              user.fours = count*nr;
          }else if(nr == 5){
              user.fivesDone = true;
              user.fives = count*nr;
          }else if(nr == 6){
              user.sixesDone = true;
              user.sixes = count*nr;
          }

          //moveToNextPlayer(current_turn, players, user);
          user.total = calcTotal(user);

          _rolls = 0;
          user.rolls = _rolls;

          // return user data to game!
          io.to(user.id).emit('game-data', user);

          // move to next player
          _turn = current_turn++ % players.length;

          io.to(user.room).emit('not_your_turn', 'test');

          // naar volgende speler bericht sturen
          var next_player = (current_turn+1);
          io.to(players[next_player++ % players.length].id).emit('your_turn', 'test');

      }
  });

  // socket.on('choice_3ofakind', result => {
  //     const user = getCurrentUser(socket.id);
  //
  //     if(user.threeOfAKindDone || !isOfAKind(result, 3)){
  //         // Throw error!
  //         io.to(socket.id).emit('error', 'Dit veld is al een keer gekozen || niet 3 dezelfde stenen');
  //     }else{
  //
  //         var count = 0;
  //         var i;
  //         for (i = 0; i < result.length; i++) {
  //           count = count + result[i];
  //         }
  //
  //         user.threeOfAKindDone = true;
  //         user.threeOfAKind = count;
  //
  //         //moveToNextPlayer(current_turn, players, user);
  //         user.total = calcTotal(user);
  //
  //         // return user data to game!
  //         io.to(user.id).emit('game-data', user);
  //
  //         // move to next player
  //         _turn = current_turn++ % players.length;
  //
  //         io.to(user.room).emit('not_your_turn', 'test');
  //
  //         // naar volgende speler bericht sturen
  //         var next_player = (current_turn+1);
  //         io.to(players[next_player++ % players.length].id).emit('your_turn', 'test');
  //     }
  // });
  //
  // socket.on('choice_4ofakind', result => {
  //     const user = getCurrentUser(socket.id);
  //
  //     if(user.fourOfAKindDone || !isOfAKind(result, 4)){
  //         // Throw error!
  //         io.to(socket.id).emit('error', 'Dit veld is al een keer gekozen || niet 4 dezelfde stenen');
  //     }else{
  //
  //         var count = 0;
  //         var i;
  //         for (i = 0; i < result.length; i++) {
  //           count = count + result[i];
  //         }
  //
  //         user.fourOfAKindDone = true;
  //         user.fourOfAKind = count;
  //
  //         //moveToNextPlayer(current_turn, players, user);
  //         user.total = calcTotal(user);
  //
  //         // return user data to game!
  //         io.to(user.id).emit('game-data', user);
  //
  //         // move to next player
  //         _turn = current_turn++ % players.length;
  //
  //         io.to(user.room).emit('not_your_turn', 'test');
  //
  //         // naar volgende speler bericht sturen
  //         var next_player = (current_turn+1);
  //         io.to(players[next_player++ % players.length].id).emit('your_turn', 'test');
  //     }
  // });
  //
  // socket.on('choice_yatzy', result => {
  //     const user = getCurrentUser(socket.id);
  //
  //     if(user.yatzyDone || !isOfAKind(result, 5)){
  //         // Throw error!
  //         io.to(socket.id).emit('error', 'Dit veld is al een keer gekozen || niet 5 dezelfde stenen');
  //     }else{
  //
  //         var count = 0;
  //         var i;
  //         for (i = 0; i < result.length; i++) {
  //           count = count + result[i];
  //         }
  //
  //         user.yatzyDone = true;
  //         user.yatzy = count;
  //
  //         //moveToNextPlayer(current_turn, players, user);
  //         user.total = calcTotal(user);
  //
  //         // return user data to game!
  //         io.to(user.id).emit('game-data', user);
  //
  //         // move to next player
  //         _turn = current_turn++ % players.length;
  //
  //         io.to(user.room).emit('not_your_turn', 'test');
  //
  //         // naar volgende speler bericht sturen
  //         var next_player = (current_turn+1);
  //         io.to(players[next_player++ % players.length].id).emit('your_turn', 'test');
  //     }
  // });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} stopt met spelen`));

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

      //console.log('A player disconnected');
      players.splice(players.indexOf(socket),1);
      _turn--;
      //console.log("A number of players now ",players.length);
    }
  });
});

// function moveToNextPlayer(current_turn, players, user){
//
//     user.total = calcTotal(user);
//
//     // return user data to game!
//     io.to(user.id).emit('game-data', user);
//
//     // move to next player
//     _turn = current_turn++ % players.length;
//
//     io.to(user.room).emit('not_your_turn', 'test');
//
//     // naar volgende speler bericht sturen
//     var next_player = (current_turn+1);
//     io.to(players[next_player++ % players.length].id).emit('your_turn', 'test');
//
//     //console.log(user.id);
//     console.log(players[next_player++ % players.length].id);
//
//     // const next_user = getCurrentUser(players[next_player++ % players.length].id);
//     // next_user.rolls = 0;
//     // io.to(next_user.id).emit('game-data', next_user);
// }

function isOfAKind(dices, nr){

    var counts = {};
    dices.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

    var i;
    for (i = 0; i < 6; i++) {
      if(counts[i] == nr){
          return true;
      }
    }
    return false;
}

function calcTotal(user){
    var total = user.ones + user.twos + user.threes + user.fours + user.fives + user.sixes;
    if(total >= 65){
        total = total + 35;
    }
    return total;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
