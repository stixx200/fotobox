import {ipcMain} from 'electron';
import {ClientProxy} from '../client.proxy';
import {TOPICS} from '../constants';
import {FotoboxError} from '../error/fotoboxError';
import {PhotoHandler} from '../photo.handler';
import {CollageMakerConfiguration, Maker} from './maker';
import {TemplateInterface} from './template.interface';
import templates from './templates';

const logger = require('logger-winston').getLogger('collage-maker');

export class CollageMaker {
  private clientProxy: ClientProxy;
  private maker: Maker = null;
  private photosaver: PhotoHandler;

  private cache: { template: TemplateInterface, photos: string[] } = null;

  constructor() {
    this.addPhotoToCollage = this.addPhotoToCollage.bind(this);
    this.initCollage = this.initCollage.bind(this);
    this.resetCollage = this.resetCollage.bind(this);
    this.getTemplates = this.getTemplates.bind(this);
  }

  init(config: CollageMakerConfiguration, externals: { photosaver: PhotoHandler, clientProxy: ClientProxy }) {
    this.maker = new Maker(config);
    this.clientProxy = externals.clientProxy;
    this.photosaver = externals.photosaver;

    ipcMain.on(TOPICS.INIT_COLLAGE, this.initCollage);
    ipcMain.on(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.on(TOPICS.RESET_COLLAGE, this.resetCollage);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.RESET_COLLAGE, this.resetCollage);
    ipcMain.removeListener(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.removeListener(TOPICS.INIT_COLLAGE, this.initCollage);

    this.maker = null;
    this.resetCollage();
  }

  async initCollage(event, templateId: string) {
    try {
      this.cache = {
        template: this.resolveTemplate(templateId),
        photos: [],
      };

      const collageBuffer = await this.maker.createCollage(this.cache.template, this.cache.photos);
      event.sender.send(TOPICS.CREATE_COLLAGE, collageBuffer);
    } catch (error) {
      logger.error('error occured while initializing collage', error);
      this.clientProxy.sendError(`Error occured while adding photo to collage: ${error.message}`);
    }
  }

  async addPhotoToCollage(event, photo: string, index: number) {
    try {
      this.cache.photos.push(photo);
      const collageBuffer = await this.maker.createCollage(this.cache.template, this.cache.photos);

      let collageName = null;
      if (this.cache.photos.length === this.cache.template.spaces.length) {
        collageName = await this.photosaver.saveBinaryCollage(collageBuffer, '.jpg');
        this.resetCollage();
      }

      event.sender.send(TOPICS.CREATE_COLLAGE, collageBuffer, collageName);
    } catch (error) {
      logger.error('error occured while adding photo to collage', error);
      this.clientProxy.sendError(`Error occured while adding photo to collage: ${error.message}`);
    }
  }

  resetCollage() {
    this.cache = null;
  }

  getTemplates(): string[] {
    return Object.keys(templates);
  }

  resolveTemplate(id: string) {
    if (!templates[id]) {
      throw new FotoboxError(`Template ${id} not found.`, 'MAIN.COLLAGE-MAKER.TEMPLATE_NOT_FOUND');
    }
    return templates[id];
  }
}
