import {ipcMain} from 'electron';
import {Subscription} from 'rxjs';
import {ClientProxy} from '../client.proxy';
import {TOPICS} from '../constants';
import {PhotoHandler} from '../photo.handler';
import {CameraInitConfiguration, CameraInterface} from './camera.interface';
import {ShutdownHandler} from '../shutdown.handler';
import {DemoCamera} from './demo';
import {SonyCamera} from './sony';

const cameras = {
  sony: SonyCamera,
  demo: DemoCamera,
};

const getCamera = (cameraDriver: string): CameraInterface => {
  if (!cameras[cameraDriver]) {
    throw new Error(`Driver '${cameraDriver}' not available.`);
  }
  return new cameras[cameraDriver]();
};

export type CameraProviderInitConfig = CameraInitConfiguration & {
  cameraDriver: string;
};

export class CameraProvider {
  private camera: CameraInterface = null;
  private liveViewSubscription: Subscription;

  constructor() {
    this.startLiveViewObserving = this.startLiveViewObserving.bind(this);
    this.stopLiveViewObserving = this.stopLiveViewObserving.bind(this);
  }

  getCameraDriverNames() {
    return Object.keys(cameras);
  }

  async init(config: CameraProviderInitConfig,
             externals: { clientProxy: ClientProxy, shutdownHandler: ShutdownHandler, photosaver: PhotoHandler }) {
    this.camera = getCamera(config.cameraDriver);
    await this.camera.init(config, externals);

    ipcMain.on(TOPICS.START_LIVEVIEW, this.startLiveViewObserving);
    ipcMain.on(TOPICS.STOP_LIVEVIEW, this.stopLiveViewObserving);

    this.camera.observePictures()
      .subscribe((fileName: string) => {
        externals.clientProxy.send(TOPICS.PHOTO, fileName);
      });
  }

  async deinit() {
    if (this.camera) {
      await this.camera.deinit();
      this.camera = null;
    }
    ipcMain.removeListener(TOPICS.START_LIVEVIEW, this.startLiveViewObserving);
    ipcMain.removeListener(TOPICS.STOP_LIVEVIEW, this.stopLiveViewObserving);
  }

  startLiveViewObserving(event: any) {
    this.liveViewSubscription = this.camera.observeLiveView()
      .subscribe((data: any) => {
        event.sender.send(TOPICS.LIVEVIEW_DATA, data);
      });
  }

  stopLiveViewObserving() {
    this.liveViewSubscription.unsubscribe();
    this.camera.stopLiveView();
  }
}
