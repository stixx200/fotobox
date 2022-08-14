import { ipcMain, IpcMainEvent } from "electron";
import { TOPICS } from "../shared/constants";
import { FotoboxMain } from "./app";
import { ClientProxy } from "./client.proxy";
import { FotoboxError } from "./error/fotoboxError";

const logger = require("logger-winston").getLogger("shutdownHandler");

export class ShutdownHandler {
  constructor(private client: ClientProxy, private app: FotoboxMain) {
    this.exitApplication = this.exitApplication.bind(this);

    ipcMain.on(TOPICS.STOP_APPLICATION, this.exitApplication);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.STOP_APPLICATION, this.exitApplication);
  }

  publishError(error: FotoboxError) {
    logger.error("Error occured. Deinit application. Restart required.", error.stack);
    this.exitApplication(null, error);
  }

  exitApplication(event: IpcMainEvent, error?: FotoboxError) {
    Promise.resolve()
      .then(() => {
        logger.warn("Deinitialize Application.");
        return this.app.deinitApplication();
      })
      .catch((err) => {
        logger.error("Deinitialization of application failed: ", err);
      })
      .then(() => {
        this.client.send(TOPICS.STOP_APPLICATION, error ? error.message : null);
      })
      .catch((err) => {
        logger.error("Sending stop event failed. ", err);
      });
  }
}
