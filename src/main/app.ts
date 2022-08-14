require("./initialize-logger");

import { dialog, ipcMain, OpenDialogOptions } from "electron";

import * as util from "util";
import { TOPICS } from "../shared/constants";
import { ApplicationInitConfiguration } from "../shared/init-configuration.interface";
import { CameraProvider } from "./cameras/camera.provider";
import { ClientProxy } from "./client.proxy";
import { CollageMaker } from "./collage-maker";
import { ConfigurationProvider } from "./configurationProvider";
import { FotoboxError } from "./error/fotoboxError";
import { PhotoHandler } from "./photo.handler";
import { PhotoProtocol } from "./photo.protocol";
import { Printer } from "./printer";
import { ShortcutHandler } from "./shortcut.handler";
import { ShutdownHandler } from "./shutdown.handler";
import BrowserWindow = Electron.BrowserWindow;

const logger = require("logger-winston").getLogger("app");

process.on("unhandledRejection", (error: any) => {
  logger.error(`Catched unhandled Rejection: ${error.stack}`);
  throw error;
});

export class FotoboxMain {
  private isInitialized = false;
  private cameraProvider = new CameraProvider();
  private clientProxy = new ClientProxy(this.window.webContents);
  private shutdownHandler = new ShutdownHandler(this.clientProxy, this);
  private photoProtocol = new PhotoProtocol();
  private collageMaker = new CollageMaker();
  private shortcutHandler = new ShortcutHandler(this.window, this.shutdownHandler, this.clientProxy);
  private printer = new Printer();
  private photoHandler = new PhotoHandler();
  private configurationProvider = new ConfigurationProvider({
    collageMaker: this.collageMaker,
  });

  constructor(private window: BrowserWindow) {
    this.initApplication = this.initApplication.bind(this);
    this.deinitApplication = this.deinitApplication.bind(this);
    this.showOpenDialog = this.showOpenDialog.bind(this);

    ipcMain.on(TOPICS.START_APPLICATION, this.initApplication);
    ipcMain.on(TOPICS.STOP_APPLICATION, this.deinitApplication);
    ipcMain.on(TOPICS.OPEN_DIALOG, this.showOpenDialog);

    logger.info("Application ready to start.");
  }

  async deinit() {
    await this.deinitApplication();
    this.shortcutHandler.deinit();
    this.configurationProvider.deinit();
    this.shutdownHandler.deinit();
  }

  async initApplication(event: any, config: ApplicationInitConfiguration) {
    try {
      if (this.isInitialized) {
        this.clientProxy.send(TOPICS.INIT_STATUSMESSAGE, "Application already running. Restart it...");
        await this.deinitApplication();
      }

      logger.info("Starting application with settings: \n", util.inspect(config));
      this.photoHandler.init(config);
      this.collageMaker.init(config, { clientProxy: this.clientProxy, photosaver: this.photoHandler });
      this.photoProtocol.init(config.photoDir, { shutdownHandler: this.shutdownHandler });
      this.printer.init(config);

      await this.cameraProvider.init(config, {
        clientProxy: this.clientProxy,
        shutdownHandler: this.shutdownHandler,
        photosaver: this.photoHandler,
      });

      this.isInitialized = true;
      this.clientProxy.send(TOPICS.START_APPLICATION);
    } catch (error) {
      if (error.message && error.message.match(/searching for wifi aborted/)) {
        logger.info("Initializing application aborted. " + error);
      }
      logger.error("Initialization of application failed: ", error);
      this.clientProxy.send(TOPICS.INIT_STATUSMESSAGE, `An error occured. Please try again. Error: ${error}`);
      this.shutdownHandler.publishError(new FotoboxError(error));
    }
  }

  async deinitApplication() {
    try {
      logger.warn("Deinitialize Application.");
      await this.cameraProvider.deinit();
      this.photoProtocol.deinit();
      this.collageMaker.deinit();
      this.printer.deinit();
      this.isInitialized = false;
      this.clientProxy.send(TOPICS.STOP_APPLICATION);
      logger.warn("Deinitialize Application finished.");
    } catch (error) {
      logger.error("Deinitialization of application failed: ", error);
    }
  }

  async showOpenDialog(event: any, options: OpenDialogOptions) {
    const result = await dialog.showOpenDialog(this.window, options);
    ipcMain.emit(TOPICS.OPEN_DIALOG_RESULT, result);
  }
}
