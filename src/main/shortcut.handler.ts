// import * as localShortcut from 'electron-localshortcut';
import { BrowserWindow, globalShortcut } from "electron";
import { TOPICS } from "../shared/constants";

import { ClientProxy } from "./client.proxy";
import { ShutdownHandler } from "./shutdown.handler";

const logger = require("logger-winston").getLogger("shortcutHandler");

export class ShortcutHandler {
  private developerToolsOpen = false;

  constructor(
    private window: BrowserWindow,
    private shutdownHandler: ShutdownHandler,
    private clientProxy: ClientProxy,
  ) {
    globalShortcut.register("F11", () => this.toggleFullscreen());
    globalShortcut.register("CmdOrCtrl+R", () => this.refreshContent());
    globalShortcut.register("F1", () => this.toggleDevTools());
    globalShortcut.register("CmdOrCtrl+Q", () => this.exitApplication());
    globalShortcut.register("CmdOrCtrl+L", () => this.gotoPhotolist());
  }

  deinit() {
    logger.info("deinitialize shortcut handler. Unregister all shortcuts.");
    globalShortcut.unregisterAll();
  }

  private toggleFullscreen() {
    logger.info("toggle full screen");
    this.window.setFullScreen(!this.window.isFullScreen());
  }

  private refreshContent() {
    logger.info("refresh");
    this.window.webContents.reload();
  }

  private toggleDevTools() {
    logger.info("toggle developer tools");
    if (this.developerToolsOpen) {
      this.window.webContents.closeDevTools();
      this.developerToolsOpen = false;
    } else {
      this.window.webContents.openDevTools();
      this.developerToolsOpen = true;
    }
  }

  private exitApplication() {
    logger.w'exit application'ion");
    this.shutdownHandler.exitApplication(null, null);
  }

  private gotoPhotolist() {
    logger.warn("show photolist");
    this.clientProxy.send(TOPICS.GOTO_PHOTOLIST);
  }
}
