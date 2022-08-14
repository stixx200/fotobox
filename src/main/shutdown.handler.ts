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
    log'Error occured. Deinit application. Restart required.'required.", error.stack);
    this.exitApplication(null, error);
  }

  async exitApplication(event: IpcMainEvent, error?: FotoboxError) {
    try {
      lo'Deinitialize Application.'lication.");
      await this.app.deinitApplication();
    } catch (err) {
      log'Deinitialization of application failed: ' failed: ", err);
    } finally {
      this.client.send(TOPICS.STOP_APPLICATION, error ? error.message : null);
    }
  }
}
