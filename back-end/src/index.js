var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

import Game from "./game";

let gameState = new Game();
const playerSockets = {};

gameState.initGameLoop(function() {
  const playerSocketIds = Object.keys(playerSockets);
  playerSocketIds.forEach(playerSockerId => {
    const socket = playerSockets[playerSockerId];
    socket.emit("game-update", gameState);
  });
});

io.on("connection", function(socket) {
  const playerId = socket.id;

  const player = gameState.addNewPlayer(socket.id);
  playerSockets[player.id] = socket;

  socket.emit("connect-success", {
    ...gameState,
    playerId
  });

  socket.on("player-change-direction", function({ dx, dy }) {
    const player = gameState.players[playerId];
    player.updateDirection({ dx, dy });
  });

  socket.on("add-bomb", function() {
    const player = gameState.players[playerId];
    gameState.addNewBomb(player);
  });

  socket.on("player-shoot", function() {
    const player = gameState.players[playerId];
    gameState.addNewBullet(player);
  });

  socket.on("disconnect", function() {
    delete playerSockets[socket.id];
    gameState.removePlayer(playerId);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
