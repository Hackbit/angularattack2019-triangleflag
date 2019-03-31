import Player from "./player";
import Bullet from "./bullet";
import { checkCollision, getRandomInt } from "./utils";
import Bomb from "./bomb";
import Powerup from "./powerup";

let nextBulletId = 1;
let nextBombId = 1;
let nextPowerupId = 1;

export default class Game {
  constructor(socketUtils) {
    this.players = {};
    this.bullets = {};
    this.bombs = {};
    this.worldSize = {
      x: 1000,
      y: 1000
    };
    this.powerups = {};
    this.socketUtils = socketUtils;

    for (let i = 0; i < Powerup.COUNT; i++) {
      nextPowerupId += 1;
      const powerup = new Powerup(nextPowerupId, this.worldSize);
      this.powerups[powerup.id] = powerup;
    }
  }

  initGameLoop(cb) {
    setInterval(() => {
      this.updateBullets();
      this.updateBombs();
      this.updatePlayers();
      this.handleBoundaryCollison();
      this.handlePlayerCollision();
      this.handlePowerupCollision();
      cb();
    }, 60);
  }

  addNewPlayer(playerId) {
    const player = new Player({
      id: playerId,
      x: getRandomInt(10, this.worldSize.x - 10),
      y: getRandomInt(10, this.worldSize.y - 10),
      dx: 0,
      dy: 0,
      health: 5
    });
    this.players[player.id] = player;
    return player;
  }

  removePlayer(playerId) {
    delete this.players[playerId];
  }

  addNewBullet(player) {
    nextBulletId = nextBulletId + 1;
    const bullet = new Bullet({
      id: nextBulletId,
      x: player.x + player.dx * Bullet.INCREMENT * 2,
      y: player.y + player.dy * Bullet.INCREMENT * 2,
      dx: player.dx,
      dy: player.dy,
      hostId: player.id
    });
    this.bullets[bullet.id] = bullet;
    return bullet;
  }

  addNewBomb(player) {
    nextBombId = nextBombId + 1;
    const bomb = new Bomb({
      id: nextBombId,
      x: player.x,
      y: player.y,
      hostId: player.id
    });
    this.bombs[bomb.id] = bomb;
    return bomb;
  }

  updatePlayers() {
    const playerIds = Object.keys(this.players);

    for (var i = 0; i < playerIds.length; i++) {
      const playerId = playerIds[i];
      const player = this.players[playerId];
      player.incrementPosition();
    }
    return;
  }

  handlePlayerDied(playerId) {
    this.socketUtils.emitPlayerDied(playerId);

    delete this.players[playerId];
  }

  updateBombs() {
    const bombIds = Object.keys(this.bombs);
    const bombsToRemove = [];

    for (var i = 0; i < bombIds.length; i++) {
      const bomb = this.bombs[bombIds[i]];
      bomb.incrementTimer();

      if (bomb.timer > Bomb.EXPLODE_TIMER && !bomb.exploded) {
        this.handleBombExplode(bomb);
      }
      if (bomb.exploded && bomb.timer > Bomb.EXPLODE_TIMER + 20) {
        bombsToRemove.push(bomb.id);
      }
    }

    bombsToRemove.forEach(b => {
      delete this.bombs[b];
    });
  }

  updateBullets() {
    const bulletIds = Object.keys(this.bullets);
    const bulletsToRemove = [];

    for (var i = 0; i < bulletIds.length; i++) {
      const bullet = this.bullets[bulletIds[i]];
      bullet.incrementPosition();
      if (bullet.updateCount > 10) {
        bulletsToRemove.push(bullet.id);
      }
    }

    bulletsToRemove.forEach(b => {
      delete this.bullets[b.id];
    });
  }

  handleBoundaryCollison() {
    const playerIds = Object.keys(this.players);
    const worldSize = this.worldSize;

    for (var i = 0; i < playerIds.length; i++) {
      const player = this.players[playerIds[i]];
      if (player.x > worldSize.x) {
        player.updateCoordinate({
          x: worldSize.x - 2,
          dx: player.dx * -1
        });
      }

      if (player.x <= 0) {
        player.updateCoordinate({
          x: 1,
          dx: player.dx * -1
        });
      }

      if (player.y > worldSize.y) {
        player.updateCoordinate({
          y: worldSize.y - 2,
          dy: player.dy * -1
        });
      }

      if (player.y <= 0) {
        player.updateCoordinate({
          y: 1,
          dy: player.dy * -1
        });
      }
    }
  }

  handlePlayerCollision() {
    const playerIds = Object.keys(this.players);

    const collidedPlayerIds = [];

    for (var i = 0; i < playerIds.length; i++) {
      const player1 = this.players[playerIds[i]];
      for (var j = 0; j < playerIds.length; j++) {
        const player2 = this.players[playerIds[j]];
        if (player1.id === player2.id) {
          continue;
        }

        const hasCollided = checkCollision(
          {
            x: player1.x,
            y: player1.y,
            width: Player.SIZE,
            height: Player.SIZE
          },
          {
            x: player2.x,
            y: player2.y,
            width: Player.SIZE,
            height: Player.SIZE
          }
        );
        if (hasCollided) {
          collidedPlayerIds.push(player1.id);
          collidedPlayerIds.push(player2.id);
        }
      }
    }

    for (var i = 0; i < collidedPlayerIds.length; i++) {
      const player = this.players[collidedPlayerIds[i]];
      player.bounceFromCollision();
    }
  }

  handleBulletCollision() {
    const playerIds = Object.keys(this.players);
    const bulletIds = Object.keys(this.bullets);

    const bulletsToRemove = [];

    for (var i = 0; i < playerIds.length; i++) {
      const player = this.players[playerIds[i]];
      for (var j = 0; j < bulletIds.length; j++) {
        const bullet = this.bullets[bulletIds[j]];
        const hasCollided = checkCollision(
          {
            x: player.x,
            y: player.y,
            width: Player.SIZE,
            height: Player.SIZE
          },
          {
            x: bullet.x,
            y: bullet.y,
            width: Bullet.SIZE,
            height: Bullet.SIZE
          }
        );

        if (hasCollided && bullet.hostId !== player.id) {
          player.decreaseHealth(1);

          bulletsToRemove.push(bullet.id);
          continue;
        }
      }
    }

    bulletsToRemove.forEach(b => {
      delete this.bullets[b];
    });
  }
  handlePowerupCollision() {
    const playerIds = Object.keys(this.players);
    const powerupIds = Object.keys(this.powerups);
    const powerupsToRemove = [];
    for (var i = 0; i < playerIds.length; i++) {
      const player = this.players[playerIds[i]];
      for (var j = 0; j < powerupIds.length; j++) {
        const powerup = this.powerups[powerupIds[j]];

        const hasCollided = checkCollision(
          {
            x: player.x,
            y: player.y,
            width: Player.SIZE,
            height: Player.SIZE
          },
          {
            x: powerup.x,
            y: powerup.y,
            width: Powerup.SIZE,
            height: Powerup.SIZE
          }
        );
        if (hasCollided) {
          player.increaseScore();
          powerupsToRemove.push(powerup.id);
        }
      }
    }

    powerupsToRemove.forEach(p => {
      delete this.powerups[p];
    });

    for (let i = 0; i < powerupsToRemove.length; i++) {
      nextPowerupId += 1;
      const powerup = new Powerup(nextPowerupId, this.worldSize);
      this.powerups[powerup.id] = powerup;
    }
  }

  handleBombExplode(bomb) {
    //   TODO

    const playerIds = Object.keys(this.players);

    const deadPlayerIds = [];

    for (var i = 0; i < playerIds.length; i++) {
      const player = this.players[playerIds[i]];
      const hasCollided = checkCollision(
        {
          x: bomb.x - Bomb.EXPLODE_SIZE / 2,
          y: bomb.y - Bomb.EXPLODE_SIZE / 2,
          width: Bomb.EXPLODE_SIZE,
          height: Bomb.EXPLODE_SIZE
        },
        {
          x: player.x,
          y: player.y,
          width: Player.SIZE,
          height: Player.SIZE
        }
      );
      if (hasCollided) {
        deadPlayerIds.push(player.id);
      }
    }

    deadPlayerIds.forEach(p => {
      this.handlePlayerDied(p);
    });

    bomb.exploded = true;
  }
}
