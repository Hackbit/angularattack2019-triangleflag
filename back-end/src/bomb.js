class Bomb {
  constructor({ id, x, y, hostId }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.hostId = hostId;
    this.timer = 0;
  }

  incrementTimer() {
    this.time = this.timer + 1;
  }
}

Bomb.INCREMENT = 5;
Bomb.SIZE = 5;
Bomb.EXPLODE_TIMER = 20;

export default Bomb;
