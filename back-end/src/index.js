var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

let gameState = {
  players: {},
  worldSize: {
    x: 3000,
    y: 3000
  },
  playerSize: {
    x: 30,
    y: 30
  }
};

function checkCollision(rect1, rect2) {
  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  ) {
    return true;
  }
  return false;
}

function handlePlayerCollision(id, { x, y, dx, dy }) {
  const playerIds = Object.keys(gameState.players);
  const playerHasCollided = false;
  const playerSize = gameState.playerSize;

  for (var i = 0; i < playerIds.length; i++) {
    const pId = playerIds[i];
    if (pId === id) {
      continue;
    }
    let subjectPlayer = gameState.players[pId];
    const hasCollided = checkCollision(
      { x, y, width: playerSize.x, height: playerSize.y },
      {
        x: subjectPlayer.x,
        y: subjectPlayer.y,
        width: playerSize.x,
        height: playerSize.y
      }
    );
    if (hasCollided) {
      const newDx = subjectPlayer.dx * -1;
      const newDy = subjectPlayer.dy * -1;
      subjectPlayer = {
        ...subjectPlayer,
        x: subjectPlayer.x + newDx,
        y: subjectPlayer.y + newDy,
        dx: newDx,
        dy: newDy
      };
      gameState.players[pId] = subjectPlayer;
    }
  }
  if (playerHasCollided) {
    const newDx = dx * -1;
    const newDy = dy * -1;
    x = x + dx;
    y = y + dy;
    dx = newDx;
    dy = newDy;
  }

  return {
    x,
    y,
    dx,
    dy
  };
}

function handleBoundaryCollision({ x, y, dx, dy }) {
  const worldSize = gameState.worldSize;

  if (x > worldSize.x) {
    x = worldSize.x - 2;
    x = dx * -1;
  }

  if (x <= 0) {
    x = 1;
    dx = dx * -1;
  }

  if (y > worldSize.y) {
    y = worldSize.y - 2;
    dy = dy * -1;
  }

  if (y <= 0) {
    y = 1;
    dy = dy * -1;
  }
  return {
    x,
    y,
    dx,
    dy
  };
}

function updatePlayers() {
  const playerIds = Object.keys(gameState.players);
  console.log(gameState);

  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];

    let newPlayerPosition = {
      x: player.x + player.dx,
      y: player.y + player.dy,
      dx: player.dx,
      dy: player.dy
    };

    newPlayerPosition = handleBoundaryCollision(newPlayerPosition);
    newPlayerPosition = handlePlayerCollision(playerId, newPlayerPosition);

    gameState.players[playerId] = {
      ...player,
      ...newPlayerPosition
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

function initPlayer(socket) {
  playerSockets[socket.id] = socket;

  const player = {
    id: socket.id,
    x: 20,
    y: 20,
    dx: 0,
    dy: 0
  };
  gameState.players[player.id] = player;
}

io.on("connection", function(socket) {
  const playerId = socket.id;

  initPlayer(socket);

  socket.emit("connect-success", { ...gameState, playerId });

  socket.on("player-change-direction", function({ dx, dy }) {
    const player = gameState.players[playerId];
    gameState.players[playerId] = {
      ...player,
      dx: dx || player.dx,
      dy: dy || player.dy
    };
  });

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
