function updatePlayers(phaserInstance, gameState) {
  const playerIds = Object.keys(gameState.players);

  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];
    if (!phaserInstance.elements[playerId]) {
      phaserInstance.elements[playerId] = phaserInstance.physics.add.sprite(
        player.x,
        player.y,
        "star"
      );
    }

    const playerElement = phaserInstance.elements[playerId];
    playerElement.x = player.x;
    playerElement.y = player.y;
  }
}

export default function updatePhaser(phaserInstance, gameState) {
  updatePlayers(phaserInstance, gameState);
}
