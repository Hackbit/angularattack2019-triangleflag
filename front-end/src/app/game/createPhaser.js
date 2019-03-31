import { addPlayer } from "./player";

function createPlayers(phaserInstance, gameState) {
  const playerIds = Object.keys(gameState.players);
  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];

    addPlayer(phaserInstance, gameState, player);
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
  phaserInstance.cursor = phaserInstance.input.keyboard.createCursorKeys();
}
