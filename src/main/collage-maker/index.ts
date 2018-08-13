import {ipcMain} from 'electron';
import {TOPICS} from '../constants';
import {PhotoHandler} from '../photo.handler';
import {ShutdownHandler} from '../shutdown.handler';
import {CollageMakerInitConfig, Maker} from './collage-maker';
import {CollageText} from './template.interface';
const logger = require('logger-winston').getLogger('collage-maker');

export class CollageMaker {
  private maker: Maker;

  constructor() {
    this.addPhotoToCollage = this.addPhotoToCollage.bind(this);
    this.initCollage = this.initCollage.bind(this);
    this.resetCollage = this.resetCollage.bind(this);
  }

  init(config: CollageMakerInitConfig, externals: { shutdownHandler: ShutdownHandler, photosaver: PhotoHandler }) {
    this.maker = new Maker(config, externals);
    ipcMain.on(TOPICS.INIT_COLLAGE, this.initCollage);
    ipcMain.on(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.on(TOPICS.RESET_COLLAGE, this.resetCollage);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.RESET_COLLAGE, this.resetCollage);
    ipcMain.removeListener(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.removeListener(TOPICS.INIT_COLLAGE, this.initCollage);
    this.maker.deinit();
    this.maker = null;
  }

  async initCollage(event, template: string, texts: CollageText[]) {
    const buffer = await this.maker.initCollage(texts, template);
    event.sender.send(TOPICS.CREATE_COLLAGE, buffer);
  }

  async addPhotoToCollage(event, photo: string, index: number) {
    try {
      const collageInfo = await this.maker.addPhotoToCollage(photo, index);
      event.sender.send(TOPICS.CREATE_COLLAGE, collageInfo.data, collageInfo.collageDone);
    } catch (error) {
      logger.error(error);
    }
  }

  resetCollage() {
    this.maker.reset();
  }
}
