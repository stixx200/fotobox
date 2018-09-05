import {globalShortcut} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import {Observable, Subject} from 'rxjs';
import {flatMap} from 'rxjs/operators';
const logger = require('logger-winston').getLogger('camera.demo');

import {ClientProxy} from '../../client.proxy';
import {PhotoHandler} from '../../photo.handler';
import {ShutdownHandler} from '../../shutdown.handler';
import {CameraInitConfiguration, CameraInterface} from '../camera.interface';

/**
 * Demo Camera
 */
export class DemoCamera implements CameraInterface {
  private photosaver: PhotoHandler;

  private liveViewSubject = new Subject<Buffer>();
  private picturesSubject = new Subject<Buffer>();

  constructor() {
    this.takePicture = this.takePicture.bind(this);
  }

  /**
   * Initializes camera
   * @param {CameraInitConfiguration} config
   * @param {{clientProxy: ClientProxy}} externals
   * @returns {Promise<void>}
   */
  async init(config: CameraInitConfiguration,
             externals: { clientProxy: ClientProxy, shutdownHandler: ShutdownHandler, photosaver: PhotoHandler }) {
    this.photosaver = externals.photosaver;

    globalShortcut.register('CmdOrCtrl+N', this.takePicture);
  }

  /**
   * Deinitializes camera
   * @returns {Promise<void>}
   */
  async deinit() {
    globalShortcut.unregister('CmdOrCtrl+N');
  }

  /**
   * Takes a picture. The new picture is published via picture observer
   */
  takePicture(): void {
    logger.info('Send new picture!');
    const dummyPictureContent = fs.readFileSync(path.join(__dirname, 'dummy.jpg'));
    this.picturesSubject.next(dummyPictureContent);
  }

  /**
   * Observes the live view.
   * @returns {Observable<Buffer>}
   */
  observeLiveView(): Observable<Buffer> {
    logger.info('Observe live view');
    return this.liveViewSubject;
  }

  /**
   * Observes the live view.
   * @returns {Observable<Buffer>}
   */
  observePictures(): Observable<string> {
    logger.info('Observe pictures');
    return this.picturesSubject.pipe(
      flatMap((buffer: Buffer) => this.photosaver.saveBinaryCollage(buffer, '.jpg')),
    );
  }

  /**
   * Stops live view.
   * @returns {Observable<string>}
   */
  stopLiveView() {
    logger.info('Stop live view');
  }
}
