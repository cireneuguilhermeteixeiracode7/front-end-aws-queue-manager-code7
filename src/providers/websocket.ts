import * as Rx from "rxjs";
import {Injectable} from "@angular/core";
import {Observable, Observer} from "rxjs";
import {AnonymousSubject} from "rxjs/internal-compatibility";

@Injectable()
export class WebsocketProvider {
    constructor() {
    }

    public connect(url, openCallback?: () => any, closeCallback?: (closeEvent: any) => any): Rx.Subject<MessageEvent> {
        let ws = new WebSocket(url);

        let observable = new Observable((obs: Rx.Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = closeCallback;
            ws.onopen = openCallback;
            return ws.close.bind(ws);
        });

        let observer: Observer<MessageEvent> = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            },
            error: err => console.log(err),
            complete: () => console.log("Desconectando!!!: ", ws.url)
        };

        return new AnonymousSubject(observer, observable);
    }
}


export const CLOSE_CODE = {
    CLOSE_NORMAL: 1000,
    CLOSE_GOING_AWAY: 1001,
    CLOSE_NO_STATUS: 1005,
    CLOSE_ABNORMAL: 1006,
    POLICY_VIOLATION: 1008
}