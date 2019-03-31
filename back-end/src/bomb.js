class Bomb {
  constructor({
    id,
    x,
    y,
    hostId
  }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.hostId = hostId;
    this.timer = 0;
    this.exploded = false;
  }

  incrementTimer() {
    this.timer = this.timer + 1;
  }
}

Bomb.INCREMENT = 5;
Bomb.SIZE = 5;
Bomb.EXPLODE_TIMER = 50;
Bomb.EXPLODE_SIZE = 100;

export default Bomb;