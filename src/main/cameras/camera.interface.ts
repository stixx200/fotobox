import {Observable} from 'rxjs';
import {ClientProxy} from '../client.proxy';
import {PhotoHandler} from '../photo.handler';

export interface CameraInitConfiguration {
  photoDir: string;
  wifiControl: boolean;
}

export interface CameraInterface {
  init(initConfig: CameraInitConfiguration, externals: { clientProxy: ClientProxy, photosaver: PhotoHandler }): Promise<void>;

  deinit(): Promise<void>;

  takePicture(): void;

  observeLiveView(): Observable<Buffer>;

  stopLiveView();

  observePictures(): Observable<string>;
}
