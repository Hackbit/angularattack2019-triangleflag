function createPlayers(phaserInstance, gameState) {
  const playerIds = Object.keys(gameState.players);
  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];
    const playerElement = phaserInstance.physics.add.sprite(
      player.x,
      player.y,
      "star"
    );
    playerElement.setCollideWorldBounds(true);
    phaserInstance.elements[playerId] = playerElement;
  }
}

function createElements(phaserInstance, gameState) {
  createPlayers(phaserInstance, gameState);
}

function initCamera(phaserInstance, gameState) {
  phaserInstance.cameras.main.setBounds(
    0,
    0,
    gameState.worldSize.x,
    gameState.worldSize.y
  );
  phaserInstance.physics.world.setBounds(
    0,
    0,
    gameState.worldSize.x,
    gameState.worldSize.y
  );

  phaserInstance.cameras.main.setBackgroundColor("#ccccff");
}

export default function createPhaser(phaserInstance, gameState) {
  phaserInstance.elements = {};
  initCamera(phaserInstance, gameState);
  createElements(phaserInstance, gameState);

  const userId = gameState.playerId;
  const userElement = phaserInstance.elements[userId];
  phaserInstance.cameras.main.startFollow(userElement, true, 1, 1);
}
