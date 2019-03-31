class Player {
  constructor({ id, x, y, dx, dy }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.health = 5;
  }

  updateDirection({ dx, dy }) {
    if (typeof dx === "number") {
      this.dx = dx;
    }
    if (typeof dy === "number") {
      this.dy = dy;
    }
  }

  updateCoordinate({ x, y, dx, dy }) {
    if (typeof x === "number") {
      this.x = x;
    }
    if (typeof y === "number") {
      this.y = y;
    }
    if (typeof dx === "number") {
      this.dx = dx;
    }
    if (typeof dy === "number") {
      this.dy = dy;
    }
  }

  incrementPosition() {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
  }

  bounceFromCollision() {
    this.dx = this.dx * -1;
    this.dy = this.dy * -1;
    this.x = this.x + 500 * this.dx;
    this.y = this.y + 500 * this.dy;
    this.health = this.health - 1;
  }

  decreaseHealth(value) {
    this.health = this.health - value;
  }
}

Player.SIZE = 10;

export default Player;
