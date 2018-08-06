import {ipcMain} from 'electron';
import {FotoboxMain} from './app';
import {ClientProxy} from './client.proxy';
import {TOPICS} from './constants';

const logger = require('logger-winston').getLogger('shutdownHandler');

export class ShutdownHandler {
  constructor(private client: ClientProxy,
              private app: FotoboxMain) {
    this.exitApplication = this.exitApplication.bind(this);

    ipcMain.on(TOPICS.STOP_APPLICATION, this.exitApplication);
  }

  publishError(error) {
    logger.error('Error occured. Deinit application. Restart required.', error.stack);
    this.exitApplication();
  }

  exitApplication() {
    Promise.resolve()
      .then(() => {
        logger.warn('Deinitialize Application.');
        return this.app.deinit();
      })
      .catch((error) => {
        logger.error('Deinitialization of application failed: ', error);
      })
      .then(() => {
        this.client.send(TOPICS.STOP_APPLICATION);
      })
      .catch((error) => {
        logger.error('Sending stop event failed. ', error);
      });
  }
}
