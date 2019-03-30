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
    if (playerElement) {
      handlePlayerMovement(phaserInstance, playerElement, player);
    }
  }
}

function handlePlayerMovement(phaserInstance, playerElement, player) {
  if (phaserInstance.cursor.left.isDown) {
    playerElement.x = player.x - 10;
  } else if (phaserInstance.cursor.right.isDown) {
    playerElement.x = player.x + 10;
  } else {
    playerElement.x = player.x;
    playerElement.y = player.y;
  }
}

export default function updatePhaser(phaserInstance, gameState) {
  updatePlayers(phaserInstance, gameState);
}
