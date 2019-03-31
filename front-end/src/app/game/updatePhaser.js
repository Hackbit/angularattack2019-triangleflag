import { SocketService } from "../socket/socket.service";

function updatePlayers(phaserInstance, gameState, socket) {
  const playerIds = Object.keys(gameState.players);

  for (var i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const player = gameState.players[playerId];
    let playerElement = phaserInstance.elements[playerId];

    if (!phaserInstance.elements[playerId]) {
      playerElement = phaserInstance.physics.add.sprite(
        player.x,
        player.y,
        "star"
      );
      phaserInstance.elements[playerId] = playerElement;

      if (playerId == gameState.playerId) {
        phaserInstance.cameras.main.startFollow(playerElement, true, 1, 1);
        phaserInstance.cursor = phaserInstance.input.keyboard.createCursorKeys();
      }
    }

    if (playerElement) {
      handlePlayerMovement(phaserInstance, playerElement, player, socket);
    }
  }
}

function handlePlayerMovement(phaserInstance, playerElement, player, socket) {
  if (phaserInstance.cursor) {
    if (phaserInstance.cursor.left.isDown) {
      socket.playerChangeDirection({ dx: -1, dy: 0 });
    } else if (phaserInstance.cursor.right.isDown) {
      socket.playerChangeDirection({ dx: 1, dy: 0 });
    } else if (phaserInstance.cursor.up.isDown) {
      socket.playerChangeDirection({ dy: -1, dx: 0 });
    } else if (phaserInstance.cursor.down.isDown) {
      socket.playerChangeDirection({ dy: 1, dx: 0 });
    }
  }
  playerElement.x = player.x;
  playerElement.y = player.y;
}

export default function updatePhaser(phaserInstance, gameState, socket) {
  updatePlayers(phaserInstance, gameState, socket);
}
