import { addPlayer } from "./player";

function updatePlayers(phaserInstance, gameState, socket) {
  const playerIds = Object.keys(gameState.players);

  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];
    let playerElement = phaserInstance.elements[playerId];

    if (!phaserInstance.elements[playerId]) {
      addPlayer(phaserInstance, gameState, player);
    }

    if (playerElement) {
      // console.log(player)
      // console.log('---',playerElement)
      playerElement.x = player.x;
      playerElement.y = player.y;
    }
    phaserInstance.physics.overlap(player, gameState.players, playerCollision, null, this);
  }
}

function playerCollision(){
  debugger
  alert('collision')
}

export default function updatePhaser(phaserInstance, gameState, socket) {
  updatePlayers(phaserInstance, gameState, socket);
}
