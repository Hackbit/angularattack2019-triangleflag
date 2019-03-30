export default function preloadPhaser(phaserInstance) {
  phaserInstance.load.image("sky", "assets/images/sky.png");
  phaserInstance.load.image("ground", "assets/images/platform.png");
  phaserInstance.load.image("star", "assets/images/star.png");
  phaserInstance.load.image("bomb", "assets/images/bomb.png");
  phaserInstance.load.spritesheet("dude", "assets/images/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}
