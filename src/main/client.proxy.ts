import { WebContents } from "electron";
import { TOPICS } from "../shared/constants";

const logger = require("logger-winston").getLogger("clientProxy");

export class ClientProxy {
  constructor(private webContents: WebContents) {}

  sendError(message, source = "unknown") {
    logger.error(`Error from '${source}': ${message}`);
    this.send(TOPICS.ERROR_MESSAGE, message);
  }

  sendStatus(message: string) {
    this.send(TOPICS.INIT_STATUSMESSAGE, message);
  }

  send(topic: string, ...args) {
    this.webContents.send(topic, ...args);
  }
}
