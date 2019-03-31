import { addPlayer } from "./player";
import { addBomb } from "./bomb";

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
      playerElement.x = player.x;
      playerElement.y = player.y;
    }
  }
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

export default function updatePhaser(phaserInstance, gameState, socket) {
  updatePlayers(phaserInstance, gameState, socket);
  updateBombs(phaserInstance, gameState, socket);
}
