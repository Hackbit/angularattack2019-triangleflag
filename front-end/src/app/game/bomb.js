export function addBomb(phaserInstance, bomb) {
  const bombElement = phaserInstance.physics.add.sprite(bomb.x, bomb.y, "bomb");
  bombElement.setDisplaySize(30, 30);
  bombElement.setCollideWorldBounds(true);

  phaserInstance.elements[`bomb-${bomb.id}`] = bombElement;
}
