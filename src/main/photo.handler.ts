import { ipcMain } from "electron";
import * as fs from "fs-extra";
import * as _ from "lodash";
import sharp from "sharp";
import { URL } from "url";
import { TOPICS } from "../shared/constants";

const path = require("path");
const download = require("download");
const logger = require("logger-winston").getLogger("photohandler");

const collageName = "collage";

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
    this.thumbDir = path.join(this.photoDir, "thumbs");

    fs.ensureDirSync(this.photoDir);
    fs.ensureDirSync(this.thumbDir);

    // read last collage number
    let allFiles = fs.readdirSync(this.photoDir);
    allFiles = allFiles.filter((name: string) => name.startsWith("collage"));
    allFiles = allFiles.sort();
    if (allFiles.length > 0) {
      const lastCollage = _.last(allFiles);
      const lastCollageName = path.basename(lastCollage, path.extname(lastCollage));
      this.lastCollageNumber = +lastCollageName.replace(collageName, "") + 1;
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
    const fileName = _.last(new URL(url).pathname.split("/"));
    logger.info(`Download file ${url} and save as ${path.join(this.photoDir, fileName)}`);
    await download(url, this.photoDir);
    const downloadedFile = path.join(this.photoDir, fileName);
    await this.createThumb(downloadedFile);
    return fileName;
  }

  async saveBinaryCollage(data: Buffer, extension: string): Promise<string> {
    const fileName = `${collageName}${this.lastCollageNumber++}${extension}`;
    const fullFileName = path.join(this.photoDir, fileName);

    await fs.writeFile(fullFileName, data);
    await this.createThumb(fullFileName);
    return fileName;
  }

  private createThumb(file, options: { width?: number } = {}) {
    const filename = path.basename(file);
    const targetFile = path.join(this.thumbDir, filename);
    return sharp(file)
      .resize(options.width || 400)
      .toFile(targetFile);
  }
}
