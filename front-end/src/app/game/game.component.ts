import { Component } from "@angular/core";
import { environment } from "../../environments/environment";

import createPhaser from "./createPhaser";
import updatePhaser from "./updatePhaser";
import preloadPhaser from "./preloadPhaser";
import { connectServer, onServerUpdate } from "./mockServer";

import { SocketService } from "../socket/socket.service";

let gameState = {};
const sService = new SocketService();

@Component({
  selector: "game-component",
  template: `
    <div>
      <phaser-component
        [gameConfig]="gameConfig"
        (gameReady)="onGameReady($event)"
      ></phaser-component>
      <br />
      <input
        (keyup)="onKey($event)"
        style="width: 660px; text-align: left;"
        value="{{ this.values }}"
      />
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
  public values: any;

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
        updatePhaser(this, gameState, sService);
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
  constructor() {
    sService.onConnectSuccess().subscribe(this.onConnectSuccess);
    sService.onGameUpdate().subscribe(this.onGameUpdate);
    this.values = ':';
  }

  onConnectSuccess(data) {
    gameState = data;
  }

  onGameUpdate(data) {
    gameState = data;
    // console.log(data);
  }

  onShoot() {
    sService.shoot();
  }

  /**
   * Game ready event handler.
   *
   * @param game Game instance.
   */
  public onGameReady(game: Phaser.Game): void {
    this.game = game;
  }

  public onKey(event: any) {
    if (event.key == 'Enter') {
      this.executeCommand(event.target.value);
      this.values = ':';
    } else {
      this.values = event.target.value;
    }
  }
  onChangeDirection({ dx, dy }) {
     sService.playerChangeDirection({ dx, dy });
  }

  public executeCommand(command: any) {
    switch (command.slice(1, command.length)) {
      case 'h':
        this.onChangeDirection({ dx: 1, dy: 0 });
        break;
      case 'l':
        this.onChangeDirection({ dx: -1, dy: 0 });
        break;
      case 'j':
        this.onChangeDirection({ dy: 1, dx: 0 });
        break;
      case 'k':
        this.onChangeDirection({ dy: -1, dx: 0 });
        break;
      default:
        console.log(command);
    }
  }
}
