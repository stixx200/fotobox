import {ipcMain} from 'electron';
import * as logging from 'logger-winston';
import {CameraProvider, CameraProviderInitConfig} from './cameras/camera.provider';
import {CollageMaker} from './collage-maker';
import {PhotoHandler} from './photo.handler';
import {Printer, PrinterConfiguration} from './printer';
import {ShortcutHandler} from './shortcut.handler';
import {ShutdownHandler} from './shutdown.handler';
import {ClientProxy} from './client.proxy';
import {ConfigurationProvider} from './configurationProvider';
import {TOPICS} from './constants';
import {PhotoProtocol} from './photo.protocol';
import BrowserWindow = Electron.BrowserWindow;
const logger = logging.getLogger('app');

logging.init({
  'logging': {
    'default': {
      'console': {
        'level': 'debug',
        'colorize': true,
        'timestamp': true,
      },
    },
  },
});


type ApplicationInitConfiguration = CameraProviderInitConfig & PrinterConfiguration;

export class FotoboxMain {
  private isInitialized = false;
  private cameraProvider = new CameraProvider();
  private configurationProvider = new ConfigurationProvider({
    cameraProvider: this.cameraProvider,
  });
  private clientProxy = new ClientProxy(this.window.webContents);
  private shutdownHandler = new ShutdownHandler(this.clientProxy, this);
  private photoProtocol = new PhotoProtocol();
  private collageMaker = new CollageMaker();
  private shortcutHandler = new ShortcutHandler(this.window, this.shutdownHandler, this.clientProxy);
  private printer = new Printer();
  private photoHandler = new PhotoHandler();

  constructor(private window: BrowserWindow) {
    this.deinit = this.deinit.bind(this);
    this.init = this.init.bind(this);

    ipcMain.on(TOPICS.START_APPLICATION, this.init);
    ipcMain.on(TOPICS.STOP_APPLICATION, this.deinit);
  }

  async init(event: any, config: ApplicationInitConfiguration) {
    try {
      if (this.isInitialized) {
        this.clientProxy.send(TOPICS.INIT_STATUSMESSAGE, 'Application already running. Restart it...');
        await this.deinit();
      }

      logger.info('Starting application with settings: ', config);
      this.photoHandler.init(config);
      this.collageMaker.init(config, {shutdownHandler: this.shutdownHandler, photosaver: this.photoHandler});
      this.photoProtocol.init(config.photoDir, {shutdownHandler: this.shutdownHandler});
      this.printer.init(config);

      await this.cameraProvider.init(config, {
        clientProxy: this.clientProxy,
        shutdownHandler: this.shutdownHandler,
        photosaver: this.photoHandler,
      });

      this.isInitialized = true;
      this.clientProxy.send(TOPICS.START_APPLICATION);
    } catch (error) {
      if (error.message.match(/searching for wifi aborted/)) {
        logger.info('Initializing application aborted. ' + error);
      }
      console.error('Initialization of application failed: ', error);
      this.clientProxy.send(TOPICS.INIT_STATUSMESSAGE, `An error occured. Please try again. Error: ${error}`);
      this.shutdownHandler.publishError(error);
    }
  }

  async deinit() {
    try {
      console.warn('Deinitialize Application.');
      await this.cameraProvider.deinit();
      this.photoProtocol.deinit();
      this.collageMaker.deinit();
      this.printer.deinit();
      this.isInitialized = false;
      this.clientProxy.send(TOPICS.STOP_APPLICATION);
    } catch (error) {
      console.error('Deinitialization of application failed: ', error);
    }
  }
}

