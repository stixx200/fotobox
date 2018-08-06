import * as http from 'http';
import {ClientRequest, IncomingMessage} from 'http';
import * as _ from 'lodash';
import {Observable, Observer, Subject} from 'rxjs';
import {ShutdownHandler} from '../../shutdown.handler';
import {CameraProxy} from './camera.proxy';
import {LiveStreamParser} from './liveStream.parser';
import {globalShortcut} from 'electron';

const request = require('superagent');
const xml2jsParseString = require('xml2js').parseString;

const promisify = require('es6-promisify');
const logger = require('logger-winston').getLogger('camera.sony.communication');

const parseString = promisify(xml2jsParseString);

const availableMethods: { name?: string, method: string, version: string, params?: any[], service: string }[] = [
  {name: 'getMethodTypesCamera', method: 'getMethodTypes', version: '1.0', service: 'camera'},
  {name: 'getMethodTypesAccessControl', method: 'getMethodTypes', version: '1.0', service: 'accessControl'},
  {method: 'takePicture', version: '1.0', service: 'camera'},
  {method: 'getApplicationInfo', version: '1.0', service: 'camera'},
  {method: 'startLiveview', version: '1.0', service: 'camera'},
  {
    name: 'enableRemoteShooting',
    method: 'setCameraFunction',
    params: ['Remote Shooting'],
    version: '1.0',
    service: 'camera',
  },
  {name: 'getCameraMethodTypes', method: 'getMethodTypes', params: ['1.0'], version: '1.0', service: 'camera'},
  {method: 'getAvailableCameraFunction', params: ['1.0'], version: '1.0', service: 'camera'},
  {method: 'getCameraFunction', version: '1.0', service: 'camera'},
  {method: 'getSupportedCameraFunction', version: '1.0', service: 'camera'},
  {name: 'takePicture', method: 'actTakePicture', version: '1.0', service: 'camera'},
  {name: 'halfPressShutter', method: 'actHalfPressShutter', version: '1.0', service: 'camera'},
  {method: 'awaitTakePicture', version: '1.0', service: 'camera'},
  {method: 'getAvailableApiList', version: '1.0', service: 'camera'},
  {method: 'startRecMode', version: '1.0', service: 'camera'},
  {method: 'stopRecMode', version: '1.0', service: 'camera'},
  {method: 'getEvent', version: '1.0', params: [true], service: 'camera'},
  {name: 'getEventImmediately', method: 'getEvent', version: '1.0', params: [false], service: 'camera'},
  {
    name: 'setImgSize',
    method: 'setPostviewImageSize',
    version: '1.0',
    params: ['2M'], // 2M
    service: 'camera',
  },
];

export class SonyCameraCommunication {
  public name: string;
  public manufacturer: string;

  public pictureUrl$ = new Subject<string>();
  private cameraProxy: CameraProxy;
  private shutdownHandler: ShutdownHandler;
  private liveviewRequest: ClientRequest;
  private statusObservation = false;

  constructor(private descriptionUrl: string) {
  }

  async init({shutdownHandler}: { shutdownHandler: ShutdownHandler }) {
    this.shutdownHandler = shutdownHandler;
    const response = await request.get(this.descriptionUrl);
    const description = await parseString(response.text);

    const device = description.root.device[0];
    const serviceList = device['av:X_ScalarWebAPI_DeviceInfo'][0]['av:X_ScalarWebAPI_ServiceList'][0]['av:X_ScalarWebAPI_Service'];

    this.name = device.friendlyName[0];
    this.manufacturer = device.manufacturer;
    const services = _.map(serviceList, (data) => ({
      type: data['av:X_ScalarWebAPI_ServiceType'][0],
      url: `${data['av:X_ScalarWebAPI_ActionList_URL'][0]}/${data['av:X_ScalarWebAPI_ServiceType'][0]}`,
    }));
    this.cameraProxy = new CameraProxy(services);

    await this.initializeCamera();
  }

  async deinit() {
    this.statusObservation = false;
    try {
      // await this.call('stopRecMode');
    } catch (error) {
      console.error(`Can't stopRecMode on camera: ${error}`);
    }
  }

  takePicture() {
    logger.error('Currently not implemented');
  }

  observeLiveView(): Observable<Buffer> {
    logger.info('Observe liveview');
    return Observable.create((observer: Observer<Buffer>) => {
      const liveStreamParser = new LiveStreamParser(observer);
      this.cameraProxy.call('camera', 'startLiveviewWithSize', ['L'])
        .then(([liveViewUrl]) => {
          this.liveviewRequest = http.get(liveViewUrl, (res: IncomingMessage) => {
            res.on('data', (chunk: Buffer) => {
              liveStreamParser.onNewChunk(chunk);
            });
            res.on('end', () => {
              observer.complete();
            });
            res.on('error', (error) => {
              observer.error(error);
            });
          });
        });
    });
  }

  stopLiveViewObserving() {
    if (this.liveviewRequest) {
      this.liveviewRequest.abort();
    }
  }

  private async initializeCamera() {
    // start rec mode
    await this.cameraProxy.call('camera', 'startRecMode');
    // get api list
    // const apiList = (await this.cameraProxy.call('camera', 'getAvailableApiList'))[0];
    this.startCameraStatusObservation();
  }

  private async startCameraStatusObservation() {
    const initialResult = await this.cameraProxy.call('camera', 'getEvent', [false], '1.3');
    this.newStatusReceived(initialResult);

    this.statusObservation = true;
    do {
      try {
        const result = await this.cameraProxy.call('camera', 'getEvent', [true], '1.3');
        this.newStatusReceived(result);
        await new Promise((r) => setTimeout(r, 200));
      } catch (error) {
        if (error.message.match(/Timed out/)) {
          continue;
        }
        console.error(`An error occured while getEvent request to camera: ${JSON.stringify(error)}`);
        this.statusObservation = false;
        this.shutdownHandler.publishError(error);
      }
    } while (this.statusObservation);
  }

  private newStatusReceived(input: any[]) {
    const newStatus = _.flatten(_.compact(input));
    logger.debug(`Received new status: ${JSON.stringify(newStatus)}`);

    _.forEach(newStatus, (status) => {
      this.parseStatus(status.type, status);
    });
  }

  private parseStatus(type: string, status: any) {
    switch (type) {
      case 'takePicture':
        const takePictureUrl = status.takePictureUrl[0];
        logger.info(`Got new picture url: ${takePictureUrl}`);
        this.pictureUrl$.next(takePictureUrl);
        break;
      default:
        break;
    }
  }
}
