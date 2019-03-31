var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

import Game from "./game";

const playerSockets = {};

let socketUtils = {
  emitPlayerDied(playerId) {
    const playerSocket = playerSockets[playerId];
    playerSocket.emit("player-dead");
    delete playerSocket[playerId];
  }
};

let gameState = new Game(socketUtils);

gameState.initGameLoop(function () {
  console.log(gameState);
  const playerSocketIds = Object.keys(playerSockets);
  playerSocketIds.forEach(playerSocketId => {
    const socket = playerSockets[playerSocketId];

    socket.emit("game-update", {
      players: gameState.players,
      bullets: gameState.bullets,
      bombs: gameState.bombs,
      powerups: gameState.powerups,
      worldSize: gameState.worldSize,
      playerId: playerSocketId
    });
  });
});

io.on("connection", function (socket) {
  const playerId = socket.id;

  const player = gameState.addNewPlayer(socket.id);
  playerSockets[player.id] = socket;

  socket.emit("connect-success", {
    ...gameState,
    playerId
  });

  socket.on("player-change-direction", function ({
    dx,
    dy
  }) {
    const player = gameState.players[playerId];
    player.updateDirection({
      dx,
      dy
    });
  });

  socket.on("player-change-position", function ({
    dx,
    dy,
    blink
  }) {
    const player = gameState.players[playerId];
    player && player.updatePosition({
      dx,
      dy,
      blink
    });
  });

  socket.on("player-blink-to-edge", function ({
    top,
    bottom
  }) {
    const player = gameState.players[playerId];
    if (top) {
      player.blinkToPosition({
        y: 100
      });
    }

    if (bottom) {
      player.blinkToPosition({
        y: gameState.worldSize.y - 100
      });
    }
  });

  socket.on("add-bomb", function () {
    const player = gameState.players[playerId];
    gameState.addNewBomb(player);
  });

  socket.on("player-shoot", function () {
    const player = gameState.players[playerId];
    gameState.addNewBullet(player);
  });

  socket.on("disconnect", function () {
    delete playerSockets[socket.id];
    gameState.removePlayer(playerId);
  });
});

var listeningPort = process.env.PORT || 3000;
http.listen(listeningPort, function () {
  console.log("listening on *:" + listeningPort);
});