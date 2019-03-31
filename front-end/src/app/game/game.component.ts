import { Component } from "@angular/core";
import { environment } from "../../environments/environment";

import createPhaser from "./createPhaser";
import updatePhaser from "./updatePhaser";
import preloadPhaser from "./preloadPhaser";

import { SocketService } from "../socket/socket.service";

let gameState = {
  playerId: null
};

const sService = new SocketService();

@Component({
  selector: "game-component",
  template: `
    <div class="game-wrap">
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
  public values: any;

  /**
   * Game configuration.
   */
  public readonly gameConfig: GameConfig = {
    title: environment.title,
    version: environment.version,
    type: Phaser.AUTO,
    width: 700,
    height: 416,
    scene: {
      create: function() {
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
    sService.onPlayerDied().subscribe(this.onPlayerDied);
    this.values = ":";
  }

  ngOnInit() {
    let stringBuffer = "";
    document.onkeypress = evt => {
      var charCode = evt.keyCode || evt.which;
      var charStr = String.fromCharCode(charCode);
      var shiftKeyTrue = evt.shiftKey;

      if (stringBuffer.length > 20) {
        stringBuffer = stringBuffer.slice(1, stringBuffer.length);
      }
      stringBuffer += charStr;

      const ggRegex = /^.*gg$/;
      const ggCapsRegex = /^.*GG$/;

      if (ggRegex.test(stringBuffer)) {
        this.onBlinkToTop();
        return;
      }

      if (ggCapsRegex.test(stringBuffer)) {
        this.onBlinkToBottom();
        return;
      }

      if (/^.*bomb$/.test(stringBuffer)) {
        this.addBomb();
        return;
      }

      switch (charStr) {
        case "h":
          this.onChangePosition({ dx: -5, dy: 0, blink: false });
          break;
        case "l":
          this.onChangePosition({ dx: 5, dy: 0, blink: false });
          break;
        case "j":
          this.onChangePosition({ dy: 5, dx: 0, blink: false });
          break;
        case "k":
          this.onChangePosition({ dy: -5, dx: 0, blink: false });
          break;
        case "e":
          this.onChangePosition({ dx: -5, dy: 0, blink: true });
          break;
        case "b":
          this.onChangePosition({ dx: 5, dy: 0, blink: true });
          break;
      }
    };
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

  onPlayerDied() {
    alert("YOU DEAD MAN");
  }

  addBomb() {
    sService.addBomb();
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
    if (event.key == "Enter") {
      this.executeCommand(event.target.value);
      this.values = ":";
    } else {
      this.values = event.target.value;
    }
  }

  onChangeDirection({ dx, dy }) {
    sService.playerChangeDirection({ dx, dy, blink: false });
  }

  onChangePosition({ dx, dy, blink }) {
    sService.playerChangePosition({ dx, dy, blink });
  }

  onBlinkToTop() {
    sService.onBlinkToTop();
  }

  onBlinkToBottom() {
    sService.onBlinkToBottom();
  }
}
