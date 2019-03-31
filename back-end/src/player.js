class Player {
  constructor({ id, x, y, dx, dy }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.health = 5;
    this.score = 0;
    this.allowBlink = true;
    this.allowBlinkPosition = true;
  }

  updateDirection({ dx, dy }) {
    if (typeof dx === "number") {
      this.dx = dx;
    }
    if (typeof dy === "number") {
      this.dy = dy;
    }
  }

  updatePosition({ dx, dy, blink }) {
    const distance = this.allowBlink && blink ? 10 : 1;

    if (typeof dx === "number") {
      this.x = this.x + dx * distance;
    }
    if (typeof dy === "number") {
      this.y = this.y + dy * distance;
    }

    this.allowBlink = false;
    setTimeout(() => {
      this.allowBlink = true;
    }, 5000);
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

  blinkToPosition({ x, y }) {
    if (!this.allowBlinkPosition) {
      return;
    }

    if (typeof x === "number") {
      this.x = x;
    }

    if (typeof y === "number") {
      this.y = y;
    }

    this.allowBlinkPosition = false;
    setTimeout(() => {
      this.allowBlinkPosition = true;
    }, 5000);
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
  }

  decreaseHealth(value) {
    this.health = this.health - value;
  }

  increaseScore() {
    this.score = this.score + 10;
  }
}

Player.SIZE = 30;

export default Player;
