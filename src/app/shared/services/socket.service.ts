import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

const SERVER_URL = environment.wsUrl;

export enum IOEventName {
  NEW_NOTIFICATION = "new-notification",
  DELETE_NOTIFICATION = "delete-notification",
  NEW_ORDER = "new-order",
  UPDATE_ORDER = "updated-order",
  STATUS_UPDATE = "status-updated",
  START_CONNECTION = "connection",
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // private socket: SocketIOClient.Socket;
  private socket: Socket;

  constructor() { }

  initSocket() {
    this.socket = io(SERVER_URL);
  }

  public onEvent<T>(event: IOEventName): Observable<T> {
    return new Observable<T>(observer => {
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
