import {ipcMain} from 'electron';
import {TOPICS} from '../constants';
import {Photosaver} from '../photosaver';
import {ShutdownHandler} from '../shutdown.handler';
import {CollageMakerInitConfig, Maker} from './collage-maker';
import {CollageText} from './template.interface';

export class CollageMaker {
  private maker: Maker;

  constructor() {
    this.createCollage = this.createCollage.bind(this);
  }

  init(config: CollageMakerInitConfig, externals: { shutdownHandler: ShutdownHandler, photosaver: Photosaver }) {
    this.maker = new Maker(config, externals);
    ipcMain.on(TOPICS.CREATE_COLLAGE, this.createCollage);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.CREATE_COLLAGE, this.createCollage);
    this.maker.deinit();
  }

  createCollage(event, texts: CollageText[], photos: string[], template: string) {
    this.maker.createCollage(texts, photos, template)
      .then((collageInfo: { data: Buffer, collageDone: string }) => {
        event.sender.send(TOPICS.CREATE_COLLAGE, collageInfo.data, collageInfo.collageDone);
      });
  }
}
