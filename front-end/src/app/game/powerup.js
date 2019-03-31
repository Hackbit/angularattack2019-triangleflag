export function addPowerup(phaserInstance, powerup) {
  const powerupElement = phaserInstance.physics.add.sprite(
    powerup.x,
    powerup.y,
    "star"
  );
  powerupElement.setDisplaySize(30, 30);
  powerupElement.setCollideWorldBounds(true);

  phaserInstance.elements[`powerup-${powerup.id}`] = powerupElement;
}
