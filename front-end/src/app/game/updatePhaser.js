import { SocketService } from '../socket/socket.service';

function updatePlayers(phaserInstance, gameState, socket) {
  const playerIds = Object.keys(gameState.players);

  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];
    if (!phaserInstance.elements[playerId]) {
      phaserInstance.elements[playerId] = phaserInstance.physics.add.sprite(
        player.x,
        player.y,
        'star'
      );
    }

    const playerElement = phaserInstance.elements[playerId];

    handlePlayerMovement(phaserInstance, playerElement, player, socket);
  }
}

function handlePlayerMovement(phaserInstance, playerElement, player, socket) {
  if (phaserInstance.cursor.left.isDown) {
    socket.playerChangeDirection({ dx: -1 });
  } else if (phaserInstance.cursor.right.isDown) {
    socket.playerChangeDirection({ dx: 1 });
    } else if (phaserInstance.cursor.up.isDown) {
      socket.playerChangeDirection({ dy: -1 });
    } else if (phaserInstance.cursor.down.isDown) {
      socket.playerChangeDirection({ dy: 1 });
  } else {
    playerElement.x = player.x;
    playerElement.y = player.y;
  }
}

export default function updatePhaser(phaserInstance, gameState, socket) {
  updatePlayers(phaserInstance, gameState, socket);
}
