export function addPlayer(phaserInstance, gameState, player) {
  const playerElement = phaserInstance.physics.add.sprite(
    player.x,
    player.y,
    "star"
  );
  playerElement.setDisplaySize(30, 30);
  playerElement.setCollideWorldBounds(true);

  if (player.id == gameState.playerId) {
    phaserInstance.cameras.main.startFollow(playerElement, true, 1, 1);
  }
  phaserInstance.elements[player.id] = playerElement;
}
