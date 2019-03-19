import {ipcMain} from 'electron';
import {ClientProxy} from '../client.proxy';
import {TOPICS} from '../constants';
import {PhotoHandler} from '../photo.handler';
import {CollageMakerInitConfig, Maker} from './collage-maker';
import {CollageText} from './template.interface';
import templates from './templates';

const logger = require('logger-winston').getLogger('collage-maker');

export class CollageMaker {
  private clientProxy: ClientProxy;
  private maker: Maker;

  constructor() {
    this.addPhotoToCollage = this.addPhotoToCollage.bind(this);
    this.initCollage = this.initCollage.bind(this);
    this.resetCollage = this.resetCollage.bind(this);
    this.getTemplates = this.getTemplates.bind(this);
  }

  init(config: CollageMakerInitConfig, externals: { photosaver: PhotoHandler, clientProxy: ClientProxy }) {
    this.maker = new Maker(config, externals);
    this.clientProxy = externals.clientProxy;

    ipcMain.on(TOPICS.INIT_COLLAGE, this.initCollage);
    ipcMain.on(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.on(TOPICS.RESET_COLLAGE, this.resetCollage);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.RESET_COLLAGE, this.resetCollage);
    ipcMain.removeListener(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.removeListener(TOPICS.INIT_COLLAGE, this.initCollage);

    if (this.maker) {
      this.maker.deinit();
      this.maker = null;
    }
  }

  async initCollage(event, template: string, texts: CollageText[]) {
    try {
      const buffer = await this.maker.initCollage(texts, template);
      event.sender.send(TOPICS.CREATE_COLLAGE, buffer);
    } catch (error) {
      logger.error('error occured while initializing collage', error);
      this.clientProxy.sendError(`Error occured while adding photo to collage: ${error.message}`);
    }
  }

  async addPhotoToCollage(event, photo: string, index: number) {
    try {
      const collageInfo = await this.maker.addPhotoToCollage(photo, index);
      event.sender.send(TOPICS.CREATE_COLLAGE, collageInfo.data, collageInfo.collageDone);
    } catch (error) {
      logger.error('error occured while adding photo to collage', error);
      this.clientProxy.sendError(`Error occured while adding photo to collage: ${error.message}`);
    }
  }

  resetCollage() {
    this.maker.reset();
  }

  getTemplates(): string[] {
    return Object.keys(templates);
  }
}
