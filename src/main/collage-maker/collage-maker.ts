import * as path from 'path';
import {Photosaver} from '../photosaver';
import {CollageText} from './template.interface';
import {TemplateLoader} from './template.loader';
import templates from './templates';

const placeholderImage = path.resolve(__dirname, './questionmark.png');

export interface CollageMakerInitConfig {
  photoDir: string;
}

export class Maker {
  private collageBuffer: Buffer;

  private photosaver: Photosaver;
  private photoDir: string;
  private templateLoader: TemplateLoader;

  constructor(config: CollageMakerInitConfig, externals: { photosaver: Photosaver }) {
    this.photoDir = config.photoDir;
    this.photosaver = externals.photosaver;
  }

  deinit() {
  }

  reset() {
    this.collageBuffer = null;
    this.templateLoader = null;
  }

  async initCollage(texts: CollageText[], templateId: string): Promise<Buffer> {
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

    const collageName = done ? await this.photosaver.saveBinaryCollage(this.collageBuffer, '.jpg') : null;
    return {
      data: buffer,
      collageDone: collageName,
    };
  }
}
