const users = [];

// Join user to chat
function userJoin(id, username, room,
    ones,
    onesDone,
    twos,
    twosDone,
    threes,
    threesDone,
    fours,
    foursDone,
    fives,
    fivesDone,
    sixes,
    sixesDone,
    bonus,
    threeOfAKind,
    threeOfAKindDone,
    fourOfAKind,
    fourOfAKindDone,
    smallStraight,
    smallStraightDone,
    largeStraight,
    largeStraightDone,
    fullHouse,
    fullHouseDone,
    chance,
    chanceDone,
    yatzy,
    yatzyDone,
    total,
    dices,
    rolls
) {
  const user = { id, username, room, ones,
  onesDone,
  twos,
  twosDone,
  threes,
  threesDone,
  fours,
  foursDone,
  fives,
  fivesDone,
  sixes,
  sixesDone,
  bonus,
  threeOfAKind,
  threeOfAKindDone,
  fourOfAKind,
  fourOfAKindDone,
  smallStraight,
  smallStraightDone,
  largeStraight,
  largeStraightDone,
  fullHouse,
  fullHouseDone,
  chance,
  chanceDone,
  yatzy,
  yatzyDone,
  total,
  dices,
  rolls };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
