import { Component } from "@angular/core";
import { environment } from "../../environments/environment";

import createPhaser from "./createPhaser";
import updatePhaser from "./updatePhaser";
import preloadPhaser from "./preloadPhaser";
import { connectServer, onServerUpdate } from "./mockServer";

import { SocketService } from "../socket/socket.service";

let gameState = {};

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
  styleUrls: ["./game.component.scss"],
  providers: [SocketService]
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
  constructor(private sService: SocketService) {
    this.sService.onConnectSuccess().subscribe(this.onConnectSuccess);
    this.sService.onGameUpdate().subscribe(this.onGameUpdate);
  }

  onConnectSuccess(data) {
    gameState = data;
  }

  onGameUpdate(data) {
    gameState = data;
    console.log(data);
  }

  onClick(e: string) {
    this.sService.pushData(e);
  }

  /**
   * Game ready event handler.
   *
   * @param game Game instance.
   */
  public onGameReady(game: Phaser.Game): void {
    this.game = game;
  }
}
