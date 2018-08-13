import * as _ from 'lodash';
import * as wifi from 'node-wifi';
import {Observable} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {ClientProxy} from '../../client.proxy';
import {PhotoHandler} from '../../photo.handler';
import {CameraInitConfiguration, CameraInterface} from '../camera.interface';
import {ShutdownHandler} from '../../shutdown.handler';
import {SonyCameraCommunication} from './camera.2';

const logger = require('logger-winston').getLogger('camera.sony');

const {Client: SsdpClient} = require('node-ssdp');

const M_SEARCH_CAMERA = 'urn:schemas-sony-com:service:ScalarWebAPI:1';
const SUPPORTED_CAMERA_NETWORKS = ['DIRECT-IGE0:ILCE-6000'];

const findSupportedNetwork = (networks) => _.find(networks, network => _.includes(SUPPORTED_CAMERA_NETWORKS, network.ssid)) || null;

/**
 * Sony Camera
 */
export class SonyCamera implements CameraInterface {
  shutdownHandler: ShutdownHandler = null;
  camera: SonyCameraCommunication;
  photosaver: PhotoHandler;

  private isInitialized = false;

  private ssdpInterval: any;

  private abortSearching = false;

  /**
   * Initializes camera
   * @param {CameraInitConfiguration} config
   * @param {{clientProxy: ClientProxy}} externals
   * @returns {Promise<void>}
   */
  async init(config: CameraInitConfiguration,
             externals: { clientProxy: ClientProxy, shutdownHandler: ShutdownHandler, photosaver: PhotoHandler }) {
    this.abortSearching = false;
    this.photosaver = externals.photosaver;
    wifi.init({iface: null}); // network interface, choose a random wifi interface if set to null
    this.shutdownHandler = externals.shutdownHandler;

    if (this.isInitialized) {
      await this.deinit();
    }

    await this.connectWifi(externals.clientProxy);
    const descriptionUrl = await this.findCamera(externals.clientProxy);
    await this.initializeCamera(externals.clientProxy, descriptionUrl);
  }

  /**
   * Deinitializes camera
   * @returns {Promise<void>}
   */
  async deinit() {
    this.abortSearching = true;

    // clear interval
    clearInterval(this.ssdpInterval);
    this.ssdpInterval = null;

    logger.info('destroy camera');
    if (this.camera) {
      await this.camera.deinit();
    }
    this.camera = null;

    // disconnect from camera
    const currentConnections = await wifi.getCurrentConnections();
    const sonyConnection = findSupportedNetwork(currentConnections);
    if (sonyConnection) {
      await wifi.disconnect();
    }
  }

  /**
   * Takes a picture. The new picture is published via picture observer
   */
  takePicture(): void {
    if (this.camera) {
      this.camera.takePicture();
    } else {
      logger.error('Can\'t take a picture. No camera connected');
    }
  }

  /**
   * Observes the live view.
   * @returns {Observable<Buffer>}
   */
  observeLiveView(): Observable<Buffer> {
    return this.camera.observeLiveView();
  }

  /**
   * Observes the live view.
   * @returns {Observable<Buffer>}
   */
  observePictures(): Observable<string> {
    return this.camera.pictureUrl$.pipe(
      flatMap((url: string) => this.photosaver.downloadAndSave(url))
    );
  }

  /**
   * Stops live view.
   * @returns {Observable<string>}
   */
  stopLiveView() {
    this.camera.stopLiveViewObserving();
  }

  /**
   * connects to cameras wifi
   * @param {ClientProxy} clientProxy
   * @returns {Promise<void>}
   */
  private async connectWifi(clientProxy: ClientProxy) {
    clientProxy.sendStatus('PAGES.SETUP.FOTOBOX.MODAL.STATUS_CONNECTING_CAMERA');
    logger.info('start connecting to Wifi');

    // find wifi network to connect
    let sonyWifiInterface = null;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (this.abortSearching) {
        throw new Error('searching for wifi aborted');
      }
      logger.debug('Scan for wifi networks');
      const networks = await wifi.scan();
      logger.debug(`Available networks: ${_.map(networks, network => network.ssid)}`);
      sonyWifiInterface = findSupportedNetwork(networks);
    } while (sonyWifiInterface === null);

    // connect to found camera network
    await wifi.connect({ssid: sonyWifiInterface.ssid, password: 'NYthQVaX'});
  }

  /**
   * searches in network for a connected camera via ssdp.
   * @param {ClientProxy} clientProxy
   * @returns {Promise<string>}
   */
  private findCamera(clientProxy: ClientProxy): Promise<string> {
    clientProxy.sendStatus('PAGES.SETUP.FOTOBOX.MODAL.STATUS_SEARCHING_CAMERA');
    logger.info('start searching for camera');

    return new Promise((resolve) => {
      const ssdpClient = new SsdpClient();

      this.ssdpInterval = setInterval(() => {
        logger.info('call SSDP search');
        ssdpClient.stop();
        ssdpClient.start();
        ssdpClient.search(M_SEARCH_CAMERA);
      }, 1000);

      ssdpClient.once('response', (headers: { LOCATION: string }) => {
        logger.info(`Found a camera: ${headers.LOCATION}`);
        ssdpClient.stop();
        clearInterval(this.ssdpInterval);
        resolve(headers.LOCATION);
      });
    });
  }

  /**
   * Configures the connected camera. Use camera accessable via descriptionUrl.
   * @param {ClientProxy} clientProxy
   * @param {string} descriptionUrl
   * @returns {Promise<void>}
   */
  private async initializeCamera(clientProxy: ClientProxy, descriptionUrl: string) {
    this.camera = new SonyCameraCommunication(descriptionUrl);
    await this.camera.init({shutdownHandler: this.shutdownHandler});
  }
}
