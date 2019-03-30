let gameState = {
  players: {},
  worldSize: {
    x: 3000,
    y: 3000
  }
};

for (var i = 0; i < 100; i++) {
  const player = {
    id: i,
    x: 20,
    y: 20,
    dx: 2,
    dy: i === 1 ? 1 : 2
  };
  gameState.players[i] = player;
}

export function connectServer() {
  return { ...gameState, playerId: 1 };
}

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

export function onServerUpdate(cb) {
  setInterval(function() {
    updatePlayers();
    cb({ ...gameState, playerId: 1 });
  }, 60);
}
