import {
  addBomb
} from './handleBomb'

var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const BULLET_SIZE = {
  x: 10,
  y: 10
};

let gameState = {
  players: {},
  bullets: {},
  bombs: {},
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

function handlePlayerCollision(id, {
  x,
  y,
  dx,
  dy
}) {
  const playerIds = Object.keys(gameState.players);
  const playerHasCollided = false;
  const playerSize = gameState.playerSize;

  for (var i = 0; i < playerIds.length; i++) {
    const pId = playerIds[i];
    if (pId === id) {
      continue;
    }
    let subjectPlayer = gameState.players[pId];
    const hasCollided = checkCollision({
      x,
      y,
      width: playerSize.x,
      height: playerSize.y
    }, {
      x: subjectPlayer.x,
      y: subjectPlayer.y,
      width: playerSize.x,
      height: playerSize.y
    });
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

function handleBoundaryCollision({
  x,
  y,
  dx,
  dy
}) {
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
  // console.log(gameState);

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

let nextBulletId = 1;

function updateBullets() {
  const bulletIds = Object.keys(gameState.bullets);
  const playerIds = Object.keys(gameState.players);

  //  checkCollision
  const bulletsToRemove = [];
  for (var i = 0; i < playerIds.length; i++) {
    const player = gameState.players[playerIds[i]];
    for (var j = 0; j < bulletIds.length; j++) {
      let bullet = gameState.bullets[bulletIds[j]];
      bullet = {
        ...bullet,
        x: bullet.x + bullet.dx,
        y: bullet.y + bullet.dy,
        updateCount: bullet.updateCount + 1
      };
      const hasCollided = checkCollision({
        x: player.x,
        y: player.y,
        width: gameState.worldSize.x,
        height: gameState.worldSize.y
      }, {
        x: bullet.x,
        y: bullet.y,
        width: BULLET_SIZE.x,
        height: BULLET_SIZE.y
      });
      if (hasCollided && bullet.hostPlayerId !== player.id) {
        gameState.players[playerIds[i]] = {
          ...player,
          health: player.health - 1
        };
        bulletsToRemove.push(bullet.id);
        continue;
      }

      if (bullet.updateCount > 10) {
        bulletsToRemove.push(bullet.id);
      }
      gameState.bullets[bulletIds[j]] = bullet;
    }
  }

  bulletsToRemove.forEach(b => {
    delete gameState.bullets[b];
  });
}

const playerSockets = {};

setInterval(function () {
  updateBullets();
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
    dy: 0,
    health: 5
  };
  gameState.players[player.id] = player;
}

io.on("connection", function (socket) {
  const playerId = socket.id;

  initPlayer(socket);

  socket.emit("connect-success", {
    ...gameState,
    playerId
  });

  socket.on("player-change-direction", function ({
    dx,
    dy
  }) {
    const player = gameState.players[playerId];
    gameState.players[playerId] = {
      ...player,
      dx: dx || player.dx,
      dy: dy || player.dy
    };
  });

  socket.on("add-bomb", () => addBomb(gameState, playerId))

  socket.on("player-shoot", function () {
    const player = gameState.players[playerId];
    const bullet = {
      id: nextBulletId + 1,
      x: player.x,
      y: player.y,
      dx: player.dx * 10,
      dy: player.dy * 10,
      hostPlayerId: player.id,
      updateCount: 0
    };
    gameState.bullets[bullet.id] = bullet;
    console.log('bullett', gameState);
  });

  socket.on("disconnect", function () {
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

http.listen(3000, function () {
  console.log("listening on *:3000");
});