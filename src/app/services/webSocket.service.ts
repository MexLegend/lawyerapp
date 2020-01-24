import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class WebSocketService {
  public socketStatus = false;
  constructor(private socket: Socket) {
    this.checkStatus();
  }

  checkStatus() {
    this.socket.on('connect', () => {
        console.log("Conectado al servidor");
        this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      this.socketStatus = false;
    });
  }

  emitEvt(event: string, payload?: any, callback?: Function) {
    this.socket.emit(event, payload, callback);
  }

  listenEvt(event: string) {
    return this.socket.fromEvent(event);
  }
}
