import { ApplicationRef, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { PhaserModule } from 'phaser-component-library'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { GameComponent } from './game/game.component'
import { LoginComponent } from './login/login.component'

/**
 * Application module.
 */
@NgModule({
  declarations: [AppComponent, GameComponent, LoginComponent],
  imports: [BrowserModule, PhaserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  /**
   * Instantiate application module.
   *
   * @param appRef Application reference, needed for [HMR](../hmr.ts).
   */
  public constructor(public appRef: ApplicationRef) {}
}
