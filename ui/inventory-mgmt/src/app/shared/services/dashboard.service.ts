import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { WebsocketService } from "./websocket.service";

const API_URL = "ws://localhost:5000/websocket";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public messages: Subject<any>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService.connect(API_URL).pipe(map(
      (response: MessageEvent): any => {
        let data = JSON.parse(response.data);
        return {
          data
        };
      }
    ));
  }
}
