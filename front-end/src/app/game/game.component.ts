import { Component } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
  selector: "game-component",
  template: `
    <div>
      <phaser-component
        [gameConfig]="gameConfig"
        (gameReady)="onGameReady($event)"
      ></phaser-component>
    </div>
  `,
  styleUrls: ["./game.component.scss"]
})
export class GameComponent {
  /**
   * Game instance.
   */
  public game: Phaser.Game;

  /**
   * Game configuration.
   */
  public readonly gameConfig: GameConfig = {
    title: environment.title,
    version: environment.version,
    type: Phaser.AUTO,
    width: 700,
    height: 400,
    scene: {
      create: function() {
        const WORLD_SIZE = {
          x: 3000,
          y: 3000
        };
        this.cameras.main.setBounds(0, 0, WORLD_SIZE.x, WORLD_SIZE.y);
        this.physics.world.setBounds(0, 0, WORLD_SIZE.x, WORLD_SIZE.y);

        this.cameras.main.setBackgroundColor("#ccccff");

        this.player = this.physics.add.sprite(30, 30, "dude");
        this.player.setCollideWorldBounds(true);

        const enemies = [];
        for (let i = 0; i < 1000; i++) {
          const enemy = this.physics.add.sprite(30, 30, "dude");
          enemies.push(enemy);
        }
        this.enemies = enemies;

        this.cameras.main.startFollow(this.player, true, 1, 1);
      },
      preload: function() {
        this.load.image("sky", "assets/images/sky.png");
        this.load.image("ground", "assets/images/platform.png");
        this.load.image("star", "assets/images/star.png");
        this.load.image("bomb", "assets/images/bomb.png");
        this.load.spritesheet("dude", "assets/images/dude.png", {
          frameWidth: 32,
          frameHeight: 48
        });
      },
      update: function() {
        this.player.x = this.player.x + 10;
        this.player.y = this.player.y + 10;

        this.enemies.forEach(e => {
          e.x = e.x + 10;
          e.y = e.y + 1;
        });
      },
      world: {}
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    }
  };

  /**
   * Instantiate application component.
   */
  public constructor() {}

  /**
   * Game ready event handler.
   *
   * @param game Game instance.
   */
  public onGameReady(game: Phaser.Game): void {
    this.game = game;
  }
}
