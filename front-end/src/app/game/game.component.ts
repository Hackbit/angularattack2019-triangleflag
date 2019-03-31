import { Component, Input, NgZone, Output, EventEmitter } from '@angular/core'
import { environment } from '../../environments/environment'

import createPhaser from './createPhaser'
import updatePhaser from './updatePhaser'
import preloadPhaser from './preloadPhaser'

import { SocketService } from '../socket/socket.service'
import { Player } from '../models/player'

let gameState = {
  playerId: null,
}

const sService = new SocketService()

@Component({
  selector: 'game-component',
  template: `
    <div *ngIf="!this.over">
      <div class="game-wrap">
        <div class="header">
          <div>
            <div class="name">
              {{ this.playerName }}
            </div>
            <div>Score: {{ this.score }}</div>
            <div class="help-container">Help</div>

            <div class="help">
              <h1>
                Controls
              </h1>

              <div style="margin-top: -45px">
                <ul>
                  <li><h3>Movement:</h3></li>
                  <li>"h" -> Move 1 step LEFT</li>
                  <li>"j" -> Move 1 step UP</li>
                  <li>"k" -> Move 1 step "DOWN"</li>
                  <li>"l" -> Move 1 step right</li>
                </ul>
                <ul>
                  <li><h3>Attack:</h3></li>
                  <li>"Type e or bomb" -> Plant a bomb</li>
                </ul>
                <ul>
                  <li>
                    <h3>Blink:</h3>
                  </li>
                  <li>"v" -> Blink right</li>
                  <li>"b" -> Blink left</li>
                  <li>"gg" -> Blink to top</li>
                  <li>"Shit + gg" -> Blink to bottom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <phaser-component
          [gameConfig]="gameConfig"
          (gameReady)="onGameReady($event)"
        ></phaser-component>
      </div>
    </div>
    <ul class="container" *ngIf="this.over">
      <h1>Scoreboard</h1>
      <li *ngFor="let p of scoreList; index as i">
        {{ p[i] && p[i].id }}
        {{ p[i] && p[i].score }}
      </li>
      <button (click)="goReload()">Reload</button>
    </ul>
  `,
  styleUrls: ['./game.component.scss'],
  providers: [SocketService],
})
export class GameComponent {
  /**
   * Game instance.
   */

  scoreList = []
  over = false

  @Input()
  playerName: string

  score: string

  public game: Phaser.Game
  public values: any

  goReload = () => {
    window.location.reload()
  }

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
        createPhaser(this, gameState)
      },
      preload: function() {
        preloadPhaser(this)
      },
      update: function() {
        updatePhaser(this, gameState, sService)
      },
      world: {},
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
  }

  /**
   * Instantiate application component.
   */
  constructor(private ngZone: NgZone) {
    sService.onConnectSuccess().subscribe(this.onConnectSuccess)
    sService.onGameUpdate().subscribe(this.onGameUpdate)
    sService.onPlayerDied().subscribe(this.onPlayerDied)
    this.values = ':'
  }

  ngOnInit() {
    let stringBuffer = ''
    console.log(this.playerName)
    document.onkeypress = evt => {
      var charCode = evt.keyCode || evt.which
      var charStr = String.fromCharCode(charCode)
      var shiftKeyTrue = evt.shiftKey

      if (stringBuffer.length > 20) {
        stringBuffer = stringBuffer.slice(1, stringBuffer.length)
      }
      stringBuffer += charStr

      const ggRegex = /^.*gg$/
      const ggCapsRegex = /^.*GG$/

      if (ggRegex.test(stringBuffer)) {
        this.onBlinkToTop()
        return
      }

      if (ggCapsRegex.test(stringBuffer)) {
        this.onBlinkToBottom()
        return
      }

      if (/^.*bomb$/.test(stringBuffer)) {
        this.addBomb()
        return
      }

      switch (charStr) {
        case 'h':
          this.onChangePosition({ dx: -5, dy: 0, blink: false })
          break
        case 'l':
          this.onChangePosition({ dx: 5, dy: 0, blink: false })
          break
        case 'j':
          this.onChangePosition({ dy: 5, dx: 0, blink: false })
          break
        case 'k':
          this.onChangePosition({ dy: -5, dx: 0, blink: false })
          break
        case 'v':
          this.onChangePosition({ dx: -5, dy: 0, blink: true })
          break
        case 'b':
          this.onChangePosition({ dx: 5, dy: 0, blink: true })
          break
        case 'e':
          this.addBomb()
          break
      }
    }
  }

  onConnectSuccess(data) {
    gameState = data
  }

  onGameUpdate = data => {
    gameState = data
    // TODO @anuj move this scores to out on template
    let player = data.players[data.playerId]
    this.ngZone &&
      this.ngZone.run(() => {
        this.score = player && player.score
        if (player) {
          this.scoreList = []
          Object.values(data.players).forEach(p =>
            this.scoreList.push([
              {
                id: p && p['id'],
                score: p && p['score'],
              },
            ])
          )
        }
      })
  }

  onShoot() {
    sService.shoot()
  }

  onPlayerDied = () => {
    this.ngZone &&
      this.ngZone.run(() => {
        this.over = true
        console.log(this.over)
      })
  }

  addBomb() {
    sService.addBomb()
  }

  /**
   * Game ready event handler.
   *
   * @param game Game instance.
   */
  public onGameReady(game: Phaser.Game): void {
    this.game = game
  }

  onChangeDirection({ dx, dy }) {
    sService.playerChangeDirection({ dx, dy, blink: false })
  }

  onChangePosition({ dx, dy, blink }) {
    sService.playerChangePosition({ dx, dy, blink })
  }

  onBlinkToTop() {
    sService.onBlinkToTop()
  }

  onBlinkToBottom() {
    sService.onBlinkToBottom()
  }
}
