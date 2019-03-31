function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Powerup {
  constructor(nextPowerupId, worldSize) {
    this.id = nextPowerupId;
    this.x = getRandomInt(10, worldSize.x - 10);
    this.y = getRandomInt(10, worldSize.y - 10);
  }
}

Powerup.SIZE = 30;
Powerup.COUNT = 50;

export default Powerup;
