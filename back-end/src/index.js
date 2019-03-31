var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

import Game from "./game";

let gameState = new Game();
const playerSockets = {};

gameState.initGameLoop(function() {
  const playerSocketIds = Object.keys(playerSockets);
  playerSocketIds.forEach(playerSocketId => {
    const socket = playerSockets[playerSocketId];

    socket.emit("game-update", {
      players: gameState.players,
      bullets: gameState.bullets,
      bombs: gameState.bombs,
      worldSize: gameState.worldSize,
      playerId: playerSocketId
    });
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

var listeningPort = process.env.PORT || 3000;
http.listen(listeningPort, function() {
  console.log("listening on *:" + listeningPort);
});
