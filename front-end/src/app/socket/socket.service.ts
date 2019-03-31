import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import * as io from 'socket.io-client'

import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {
  observable: Observable<string>
  socket
  constructor() {
    this.socket = io(environment.socketURL)
  }

  onConnectSuccess(): Observable<string> {
    return (this.observable = new Observable(observer => {
      this.socket.on('connect-success', data => observer.next(data))
    }))
  }

  onGameUpdate(): Observable<string> {
    return (this.observable = new Observable(observer => {
      this.socket.on('game-update', data => {
        data.bullets['2'] && console.log(data)
        observer.next(data)
      })
    }))
  }

  playerChangeDirection(direction) {
    this.socket.emit('player-change-direction', direction)
  }

  shoot() {
    this.socket.emit('player-shoot')
  }

  addBomb() {
    this.socket.emit('add-bomb')
  }

  //This one is for send data from angular to node
  pushData(e) {
    this.socket.emit('hello', e)
  }
}
