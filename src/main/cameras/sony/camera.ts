const request = require('superagent');
const xml2jsParseString = require('xml2js').parseString;
import {EventEmitter} from 'events';
import * as _ from 'lodash';

const promisify = require('es6-promisify');
const logger = require('logger-winston').getLogger('camera.sony.communication');

const parseString = promisify(xml2jsParseString);

let _id = 0;

function id() {
  return _id++;
}

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

export class SonyCameraCommunication extends EventEmitter {
  name: string;
  manufacturer: string;
  services: { type: string, url: string }[];

  // status fields
  availableApiList: string[];
  cameraStatus: string;
  cameraFunction: string;
  possibleCameraFunction: string[];
  postviewImageSize: string;
  possiblePostviewImageSize: string[];
  selfTimer: number;
  possibleSelfTimer: number[];
  takePictureUrl: string;

  // parser
  parser = {
    availableApiList(status: { names: string[] }) {
      this.availableApiList = status.names;
    },
    cameraStatus(status: { cameraStatus: string }) {
      this.cameraStatus = status.cameraStatus;
    },
    cameraFunction(status: { currentCameraFunction: string, cameraFunctionCandidates: string[] }) {
      this.cameraFunction = status.currentCameraFunction;
      this.possibleCameraFunction = status.cameraFunctionCandidates;
    },
    postviewImageSize(status: { currentPostviewImageSize: string, postviewImageSizeCandidates: string[] }) {
      this.postviewImageSize = status.currentPostviewImageSize;
      this.possiblePostviewImageSize = status.postviewImageSizeCandidates;
    },
    selfTimer(status: { currentSelfTimer: number, selfTimerCandidates: number[] }) {
      this.selfTimer = status.currentSelfTimer;
      this.possibleSelfTimer = status.selfTimerCandidates;
    },
    takePicture(status: { takePictureUrl: string[] }) {
      this.takePictureUrl = status.takePictureUrl[0];
      logger.info(`Got new picture url: ${this.takePictureUrl}`);
      this.emit('pictureTaken', this.takePictureUrl);
    },
  };

  private statusObservation = false;

  constructor(private descriptionUrl: string) {
    super();
  }

  async init() {
    const response = await request.get(this.descriptionUrl);
    const description = await parseString(response.text);

    const device = description.root.device[0];
    const serviceList = device['av:X_ScalarWebAPI_DeviceInfo'][0]['av:X_ScalarWebAPI_ServiceList'][0]['av:X_ScalarWebAPI_Service'];

    this.name = device.friendlyName[0];
    this.manufacturer = device.manufacturer;
    this.services = _.map(serviceList, (data) => ({
      type: data['av:X_ScalarWebAPI_ServiceType'][0],
      url: `${data['av:X_ScalarWebAPI_ActionList_URL'][0]}/${data['av:X_ScalarWebAPI_ServiceType'][0]}`,
    }));

    await this.initializeCamera();
  }

  async deinit() {
    this.removeAllListeners();
    this.statusObservation = false;
    try {
      await this.call('stopRecMode');
    } catch (error) {
      console.error(`Can't stopRecMode on camera: ${error}`);
    }
  }

  takePicture() {
    logger.error('Currently not implemented');
  }

  parseStatus(type: string, status: any) {
    const statusParser = this.parser[type];
    if (statusParser) {
      statusParser.call(this, status);
    }
  }

  private async initializeCamera() {
    await this.getAvailableApiList();
    await this.startRecMode();
    await this.startCameraStatusObservation();
  }

  private async startCameraStatusObservation() {
    const {result: initialEvents} = await this.call('getEventImmediately');
    this.newStatusReceived(initialEvents);

    this.statusObservation = true;
    do {
      try {
        const {result: events} = await this.call('getEvent');
        this.newStatusReceived(events);
        await new Promise((r) => setTimeout(r, 200));
      } catch (error) {
        console.error(`An error occured while getEvent request to camera: ${JSON.stringify(error)}`);
        this.statusObservation = false;
        this.emit('disconnected');
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

  private async startRecMode(): Promise<void> {
    if (_.includes(this.availableApiList, 'setPostviewImageSize')) {
      await this.call('setImgSize');
    }
    if (_.includes(this.availableApiList, 'startRecMode')) {
      await this.call('startRecMode');
    }
  }

  private async getAvailableApiList() {
    const result = await this.call('getAvailableApiList');
    this.availableApiList = _.flatten(result.result);
  }

  private async call(apiName: string) {
    let method = _.find(availableMethods, ['name', apiName]);
    if (!method) {
      method = _.find(availableMethods, ['method', apiName]);
    }
    if (!method) {
      return Promise.reject(`method ${apiName} not found.`);
    }
    if (!_.includes(this.availableApiList, method.method) && apiName !== 'getAvailableApiList') {
      return Promise.reject(`method ${method.method} currently not available. Available are: ${JSON.stringify(this.availableApiList)}`);
    }

    const service = _.find(this.services, ['type', method.service]);
    if (!service) {
      return Promise.reject(`service ${method.service} is not available. Available are: ${JSON.stringify(this.services)}`);
    }

    const response = await request.post(service.url)
      .set('Content-Type', 'application/json')
      .send({
        method: method.method,
        params: method.params || [],
        id: id(),
        version: method.version,
      });

    if (response.body.error) {
      throw new Error(`${service.type} - REST POST ${service.url} failed. Response error: ${response.body.error}`);
    }
    return JSON.parse(response.body);
  }
}
