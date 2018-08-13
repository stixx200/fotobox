import * as _ from 'lodash';
import {from} from 'rxjs';
import {URL} from 'url';
const path = require('path');
const thumb = require('node-thumbnail').thumb;
const download = require('download');
import * as fs from 'fs-extra';
import {ClientProxy} from './client.proxy';
import {ipcMain} from 'electron';
import {TOPICS} from './constants';

const thumbSettings = {
  width: 400,
  suffix: '',
};
const collageName = 'collage';

export interface PhotoHandlerConfig {
  photoDir: string;
}

export class PhotoHandler {
  private photoDir: string;
  private thumbDir: string;
  private lastCollageNumber = 0;

  constructor() {
    this.sendAllPhotos = this.sendAllPhotos.bind(this);

    ipcMain.on(TOPICS.ALL_PHOTOS, this.sendAllPhotos);
  }

  init(config: PhotoHandlerConfig) {
    this.photoDir = config.photoDir;
    this.thumbDir = path.join(this.photoDir, 'thumbs');

    fs.ensureDirSync(this.photoDir);
    fs.ensureDirSync(this.thumbDir);

    // read last collage number
    let allFiles = fs.readdirSync(this.photoDir);
    allFiles = allFiles.filter((name: string) => name.startsWith('collage'));
    allFiles = allFiles.sort();
    if (allFiles.length > 0) {
      const lastCollage = _.last(allFiles);
      const lastCollageName = path.basename(lastCollage, path.extname(lastCollage));
      this.lastCollageNumber = (+lastCollageName.replace(collageName, '')) + 1;
    }
  }

  deinit() {
    ipcMain.removeListener(TOPICS.ALL_PHOTOS, this.sendAllPhotos);
  }

  sendAllPhotos(event) {
    const allFiles = fs.readdirSync(this.photoDir);
    const allPhotos = allFiles.filter((fileName) => fs.statSync(path.join(this.photoDir, fileName)).isFile());
    event.sender.send(TOPICS.ALL_PHOTOS, allPhotos);
  }

  async downloadAndSave(url: string): Promise<string> {
    const fileName = _.last(new URL(url).pathname.split('/'));
    await from(download(url, this.photoDir));
    await thumb({...thumbSettings, source: path.join(this.photoDir, fileName), destination: this.thumbDir});
    return fileName;
  }

  async saveBinaryCollage(data: Buffer, extension: string): Promise<string> {
    const fileName = `${collageName}${this.lastCollageNumber++}${extension}`;
    const fullFileName = path.join(this.photoDir, fileName);
    fs.writeFileSync(fullFileName, data);
    await thumb({...thumbSettings, source: fullFileName, destination: this.thumbDir});
    return fileName;
  }
}
