import * as path from 'path';
import {PhotoHandler} from '../photo.handler';
import {CollageText} from './template.interface';
import {TemplateLoader} from './template.loader';
import templates from './templates';

const logger = require('logger-winston').getLogger('collage-maker');

const placeholderImage = path.resolve(__dirname, './questionmark.png');

export interface CollageMakerInitConfig {
  photoDir: string;
}

export class Maker {
  private collageBuffer: Buffer;
  private saveCollage: boolean;

  private photosaver: PhotoHandler;
  private photoDir: string;
  private templateLoader: TemplateLoader;

  constructor(config: CollageMakerInitConfig, externals: { photosaver: PhotoHandler }) {
    this.photoDir = config.photoDir;
    this.photosaver = externals.photosaver;
    this.reset();
  }

  deinit() {
  }

  reset() {
    this.collageBuffer = null;
    this.templateLoader = null;
    this.saveCollage = true;
  }

  async initCollage(texts: CollageText[], templateId: string, saveCollage: boolean = true): Promise<Buffer> {
    logger.info(`Initializing collage: ${templateId}`);
    this.saveCollage = saveCollage;
    this.templateLoader = new TemplateLoader(templates[templateId]);
    this.collageBuffer = await this.templateLoader.getEmptyCollage(texts, placeholderImage);
    return this.collageBuffer;
  }

  async addPhotoToCollage(photo: string, index: number): Promise<{ data: Buffer, collageDone: string }> {
    if (!this.collageBuffer) {
      throw new Error('Can\'t add a photo to a collage if there is no collage buffered.');
    }
    const photoToAdd = path.resolve(this.photoDir, photo);
    const {buffer, done} = await this.templateLoader.addPhotoToCollage(this.collageBuffer, photoToAdd, index);
    this.collageBuffer = buffer;

    let collageName = null;
    if (done) {
      collageName = await this.photosaver.saveBinaryCollage(this.collageBuffer, '.jpg');
      this.reset();
    }

    return {
      data: buffer,
      collageDone: collageName,
    };
  }
}
