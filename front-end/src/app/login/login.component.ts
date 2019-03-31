import { Component, OnInit } from '@angular/core'
import { Player } from '../models/player'
import { userInfo } from 'os'

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  player: Player = new Player()
  page = {
    LOGIN: 1,
    GAME: 2,
    CONTROLS: 3,
    LINKED_IN: 4,
  }
  pageNumber: number = this.page.GAME

  constructor() {}

  ngOnInit() {}

  goToControlsPage() {
    this.pageNumber = this.page.CONTROLS
  }

  goToLogin() {
    this.pageNumber = this.page.LOGIN
  }

  startGame() {
    this.pageNumber = this.page.GAME
  }

  goToLinkedIn() {
    this.pageNumber = this.page.LINKED_IN
  }
}
