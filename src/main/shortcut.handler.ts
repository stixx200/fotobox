import {globalShortcut} from 'electron';
import {ShutdownHandler} from './shutdown.handler';
import BrowserWindow = Electron.BrowserWindow;

const logger = require('logger-winston').getLogger('shutdownHandler');

export class ShortcutHandler {
  private developerToolsOpen = false;

  constructor(private window: BrowserWindow, private shutdownHandler: ShutdownHandler) {
    globalShortcut.register('F11', () => this.toggleFullscreen());
    globalShortcut.register('CmdOrCtrl+R', () => this.refreshContent());
    globalShortcut.register('F1', () => this.toggleDevTools());
    globalShortcut.register('CmdOrCtrl+Q', () => this.exitApplication());
  }

  private toggleFullscreen() {
    logger.info('toggle full screen');
    this.window.setFullScreen(!this.window.isFullScreen());
  }

  private refreshContent() {
    logger.info('refresh');
    this.window.webContents.reload();
  }

  private toggleDevTools() {
    logger.info('toggle developer tools');
    if (this.developerToolsOpen) {
      this.window.webContents.closeDevTools();
      this.developerToolsOpen = false;
    } else {
      this.window.webContents.openDevTools();
      this.developerToolsOpen = true;
    }
  }

  private exitApplication() {
    logger.warn('exit application');
    this.shutdownHandler.exitApplication();
  }
}
