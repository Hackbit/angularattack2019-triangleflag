import { Component } from '@angular/core'

/**
 * Application component.
 */
@Component({
  selector: 'app-root',
  template: `
    <div>
      <login-component></login-component>
      <game-component></game-component>
    </div>
  `,
})
export class AppComponent {}
