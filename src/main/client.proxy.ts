import { WebContents } from 'electron';
import {TOPICS} from './constants';


export class ClientProxy {
  constructor(private webContents: WebContents) {
  }

  sendStatus(message: string) {
    this.send(TOPICS.INIT_STATUSMESSAGE, message);
  }

  send(topic: string, ...args) {
    this.webContents.send(topic, ...args);
  }
}
