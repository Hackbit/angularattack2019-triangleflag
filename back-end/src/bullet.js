class Bullet {
  constructor({ id, x, y, dx, dy, hostId }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.hostId = hostId;

    this.updateCount = 0;
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
    this.x = this.x + this.dx * Bullet.INCREMENT;
    this.y = this.y + this.dy * Bullet.INCREMENT;
    this.updateCount = this.updateCount + 1;
  }
}

Bullet.INCREMENT = 5;
Bullet.SIZE = 5;

export default Bullet;
