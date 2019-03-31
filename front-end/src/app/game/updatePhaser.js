import { addPlayer } from "./player";
import { addBomb } from "./bomb";
import { addPowerup } from "./powerup";

function updatePlayers(phaserInstance, gameState, socket) {
  const playerIds = Object.keys(gameState.players);

  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];
    let playerElement = phaserInstance.elements[playerId];

    if (!playerElement) {
      addPlayer(phaserInstance, gameState, player);
    }

    if (playerElement) {
      // console.log(player)
      // console.log('---',playerElement)
      playerElement.x = player.x;
      playerElement.y = player.y;
    }
    phaserInstance.physics.overlap(
      player,
      gameState.players,
      playerCollision,
      null,
      this
    );
  }
}

function playerCollision() {
  debugger;
  alert("collision");
}

function updateBombs(phaserInstance, gameState) {
  const bombIds = Object.keys(gameState.bombs);
  for (var i = 0; i < bombIds.length; i++) {
    const bombId = bombIds[i];

    const bomb = gameState.bombs[bombId];

    let bombElement = phaserInstance.elements[`bomb-${bombId}`];
    if (!bombElement) {
      addBomb(phaserInstance, bomb);
    }

    if (bomb.exploded) {
      bombElement.x = bomb.x - 50;
      bombElement.y = bomb.y - 50;
      bombElement.setDisplaySize(100, 100);
      bombElement.backgroundColor = "#FF00FF";
      // TODO: ANUJ : Change bombElement sprite image to explosion
    }
  }
}

function updatePowerups(phaserInstance, gameState, socket) {
  const powerupIds = Object.keys(gameState.powerups);
  for (var i = 0; i < powerupIds.length; i++) {
    const powerupId = powerupIds[i];
    const powerup = gameState.powerups[powerupId];

    let powerupElement = phaserInstance.elements[`powerup-${powerupId}`];
    if (!powerupElement) {
      addPowerup(phaserInstance, powerup);
    }
  }
}

function cleanupElements(phaserInstance, gameState) {
  const elementIds = Object.keys(phaserInstance.elements);
  let ids = [];
  ids = ids.concat(Object.keys(gameState.players));
  ids = ids.concat(Object.keys(gameState.bombs).map(id => `bomb-${id}`));
  ids = ids.concat(Object.keys(gameState.powerups).map(id => `powerup-${id}`));
  const elementsToRemove = elementIds.filter(eid => {
    return ids.indexOf(eid) === -1;
  });
  elementsToRemove.forEach(eid => {
    const peleme = phaserInstance.elements[eid];
    peleme.destroy();
    delete phaserInstance.elements[eid];
  });
}

export default function updatePhaser(phaserInstance, gameState, socket) {
  updatePlayers(phaserInstance, gameState, socket);
  updateBombs(phaserInstance, gameState, socket);
  updatePowerups(phaserInstance, gameState, socket);
  cleanupElements(phaserInstance, gameState);
}
