import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import * as io from "socket.io-client";

@Injectable()
export class SocketService {
  observable: Observable<string>;
  socket;
  constructor() {
    this.socket = io("http://localhost:3000");
  }

  onConnectSuccess(): Observable<string> {
    return (this.observable = new Observable(observer => {
      this.socket.on("connect-success", data => observer.next(data));
    }));
  }

  onGameUpdate(): Observable<string> {
    return (this.observable = new Observable(observer => {
      this.socket.on("game-update", data => observer.next(data));
    }));
  }

  //This one is for send data from angular to node
  pushData(e) {
    this.socket.emit("hello", e);
  }
}
