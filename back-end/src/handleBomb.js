let nextBombId = 0;

export const addBomb = (gameState, playerId) => {
    console.log(gameState, nextBombId)
    nextBombId += 1
    const player = gameState.players[playerId];
    const bomb = {
        id: nextBombId,
        x: player.x,
        y: player.y,
        dx: player.dx * 10,
        dy: player.dy * 10,
        hostPlayerId: player.id,
        updateCount: 0
    };
    gameState.bombs[bomb.id] = bomb;
    return bomb;
}