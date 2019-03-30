var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

let gameState = {
  players: {},
  worldSize: {
    x: 3000,
    y: 3000
  }
};

function updatePlayers() {
  const playerIds = Object.keys(gameState.players);
  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];

    gameState.players[playerId] = {
      ...player,
      x: player.x + player.dx,
      y: player.y + player.dy
    };
  }
}

const playerSockets = {};

setInterval(function() {
  updatePlayers();
  const playerSocketIds = Object.keys(playerSockets);
  playerSocketIds.forEach(playerSockerId => {
    const socket = playerSockets[playerSockerId];
    socket.emit("game-update", gameState);
  });
}, 60);

io.on("connection", function(socket) {
  console.log("a user connected", socket.id);

  const playerId = socket.id;
  playerSockets[socket.id] = socket;

  const player = {
    id: socket.id,
    x: 20,
    y: 20,
    dx: 0,
    dy: 0
  };
  gameState.players[player.id] = player;

  socket.emit("connect-success", { ...gameState, playerId });

  socket.on("disconnect", function() {
    delete playerSockets[socket.id];
    delete gameState.players[socket.id];
    console.log("user disconnected");
  });

  //   socket.on("chat message", function(msg) {
  //     console.log("message: " + msg);
  //     io.emit("chat message", msg);
  //   });

  //   socket.broadcast.emit("hi");
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
