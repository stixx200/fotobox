import * as path from 'path';
import {Photosaver} from '../photosaver';
import {ShutdownHandler} from '../shutdown.handler';
import {CollageText} from './template.interface';
import {TemplateLoader} from './template.loader';
import templates from './templates';

const placeholderImage = path.resolve(__dirname, './questionmark.png');

const enum CollageMakerState {
  initial,
}

export interface CollageMakerInitConfig {
  photoDir: string;
}

export class Maker {
  private state: CollageMakerState = CollageMakerState.initial;
  private collageBuffer: Buffer;

  private photosaver: Photosaver;
  private photoDir: string;
  private shutdownHandler: ShutdownHandler;
  private templateLoader: TemplateLoader;

  constructor(config: CollageMakerInitConfig, externals: { shutdownHandler: ShutdownHandler, photosaver: Photosaver }) {
    this.photoDir = config.photoDir;
    this.shutdownHandler = externals.shutdownHandler;
    this.photosaver = externals.photosaver;
  }

  deinit() {
  }

  reset() {
    this.state = CollageMakerState.initial;
    this.collageBuffer = null;
  }

  async createCollage(texts: CollageText[], photos: string[], templateId: string): Promise<{ data: Buffer, collageDone: string }> {
    if (this.state !== CollageMakerState.initial && this.templateLoader.getTemplateId() !== templateId) {
      this.reset();
    }

    const template = templates[templateId];
    this.templateLoader = new TemplateLoader(template);
    const data = await this.templateLoader.getTemplateContent(texts, this.getPictures(photos), '');
    const done = this.templateLoader.getPhotoCount() <= photos.length;
    let newCollageName;
    if (done) {
      newCollageName = await this.photosaver.saveBinaryCollage(data, '.jpg');
    }
    return {data, collageDone: newCollageName};
  }

  private getPictures(pictures: string[]): string[] {
    const picturesToDraw: string[] = [];
    for (let i = 0; i < this.templateLoader.getPhotoCount(); i++) {
      if (pictures[i]) {
        picturesToDraw.push(path.resolve(this.photoDir, pictures[i]));
      } else {
        picturesToDraw.push(placeholderImage);
      }
    }
    return picturesToDraw;
  }
}
