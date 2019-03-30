import { Component } from "@angular/core";
import { environment } from "../../environments/environment";

import createPhaser from "./createPhaser";
import updatePhaser from "./updatePhaser";
import preloadPhaser from "./preloadPhaser";
import { connectServer, onServerUpdate } from "./mockServer";

let gameState = {};

onServerUpdate(function(newGameState) {
  gameState = newGameState;
});

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
        gameState = connectServer();
        createPhaser(this, gameState);
      },
      preload: function() {
        preloadPhaser(this);
      },
      update: function() {
        updatePhaser(this, gameState);
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
