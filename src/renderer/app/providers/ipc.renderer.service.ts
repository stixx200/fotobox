import {Injectable, NgZone} from '@angular/core';
import {ElectronService} from './electron.service';

@Injectable()
export class IpcRendererService {
    private registeredFunctions: { listener: Function, registered: Function }[] = [];

    constructor(private electron: ElectronService,
                private _zone: NgZone) {
    }

    on(channel: string, listener: Function) {
        console.log('Registered on ' + channel);
        const onEvent = (...args: any[]) => {
            this._zone.run(() => {
                listener(...args);
            });
        };
        this.registeredFunctions.push({listener, registered: onEvent});
        return this.electron.ipcRenderer.on(channel, onEvent);
    }

    removeListener(channel: string, listener: Function) {
      console.log('Unregistered from ' + channel);
        const onEvent = this.registeredFunctions.find((value) => (value.listener === listener)).registered;
        return this.electron.ipcRenderer.removeListener(channel, onEvent);
    }

    sendSync(channel: string, ...args: any[]): any {
        return this.electron.ipcRenderer.sendSync(channel, ...args);
    }

    send(channel: string, ...args: any[]): any {
        return this.electron.ipcRenderer.send(channel, ...args);
    }
}
