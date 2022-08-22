import { ipcMain } from "electron";
import * as fs from "fs-extra";
import * as _ from "lodash";
import * as path from "path";
import { TOPICS } from "../../shared/constants";
import { CollageMakerConfiguration } from "../../shared/init-configuration.interface";
import { ClientProxy } from "../client.proxy";
import { FotoboxError } from "../error/fotoboxError";
import { PhotoHandler } from "../photo.handler";
import { Maker } from "./maker";
import { TemplateInterface } from "./template.interface";
import builtInTemplates from "./templates";

const logger = require("logger-winston").getLogger("collage-maker");

export class CollageMaker {
  private static getPreviewPhoto = (function* () {
    const previewPhotos = [
      path.join(__dirname, "./images/party_0.jpg"),
      path.join(__dirname, "./images/party_1.jpg"),
      path.join(__dirname, "./images/party_2.jpg"),
      path.join(__dirname, "./images/party_3.jpg"),
      path.join(__dirname, "./images/party_4.jpg"),
    ];
    let idx = 0;
    do {
      yield previewPhotos[idx];
      idx = idx + 1 >= previewPhotos.length ? 0 : idx + 1;
    } while (true);
  })();

  private clientProxy: ClientProxy;
  private maker: Maker = null;
  private photosaver: PhotoHandler;

  private cache: { template: TemplateInterface; photos: string[] } = null;

  constructor() {
    this.addPhotoToCollage = this.addPhotoToCollage.bind(this);
    this.initCollage = this.initCollage.bind(this);
    this.resetCollage = this.resetCollage.bind(this);
    this.createCollagePreview = this.createCollagePreview.bind(this);
  }

  init(config: CollageMakerConfiguration, externals: { photosaver: PhotoHandler; clientProxy: ClientProxy }) {
    this.maker = new Maker(config);
    this.clientProxy = externals.clientProxy;
    this.photosaver = externals.photosaver;

    ipcMain.on(TOPICS.INIT_COLLAGE, this.initCollage);
    ipcMain.on(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.on(TOPICS.RESET_COLLAGE, this.resetCollage);
    ipcMain.on(TOPICS.CREATE_COLLAGE_PREVIEW_SYNC, this.createCollagePreview);
  }

  deinit() {
    logger.info("Deinitialize collage maker");
    ipcMain.removeListener(TOPICS.RESET_COLLAGE, this.resetCollage);
    ipcMain.removeListener(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.removeListener(TOPICS.INIT_COLLAGE, this.initCollage);
    ipcMain.removeListener(TOPICS.CREATE_COLLAGE_PREVIEW_SYNC, this.createCollagePreview);

    this.photosaver = null;
    this.clientProxy = null;
    this.maker = null;
    this.resetCollage();
  }

  async createCollagePreview(event, templateId: string, templateDirectory: string) {
    logger.info(`Create collage preview: '${templateId}' (directory: '${templateDirectory}')`);
    try {
      const template = this.resolveTemplate(templateId, templateDirectory);
      const photoCount = this.maker.getPhotoCount(template);
      event.returnValue = await this.maker.createCollage(
        template,
        _.times(photoCount, () => CollageMaker.getPreviewPhoto.next().value),
      );
    } catch (error) {
      logger.error("error occured while creating preview collage", error);
      this.clientProxy.sendError(`Error occured while creating preview collage: ${error.message}`);
    }
  }

  async initCollage(event, templateId: string, templateDirectory: string) {
    logger.info(`Initialize collage: '${templateId}' (directory: '${templateDirectory}')`);
    try {
      this.cache = {
        template: this.resolveTemplate(templateId, templateDirectory),
        photos: [],
      };
      event.returnValue = this.maker.getPhotoCount(this.cache.template);
      const collageBuffer = await this.maker.createCollage(this.cache.template, this.cache.photos);
      event.sender.send(TOPICS.CREATE_COLLAGE, collageBuffer);
    } catch (error) {
      logger.error("error occured while initializing collage", error);
      this.clientProxy.sendError(`Error occured while adding photo to collage: ${error.message}`);
    }
  }

  async addPhotoToCollage(event, photo: string) {
    logger.info(`Add photo to collage: '${photo}'`);
    try {
      this.cache.photos.push(photo);
      const collageBuffer = await this.maker.createCollage(this.cache.template, this.cache.photos);

      let collageName = null;
      if (this.cache.photos.length === this.cache.template.spaces.length) {
        collageName = await this.photosaver.saveBinaryCollage(collageBuffer, ".jpg");
        this.resetCollage();
      }

      event.sender.send(TOPICS.CREATE_COLLAGE, collageBuffer, collageName);
    } catch (error) {
      logger.error("error occured while adding photo to collage", error);
      this.clientProxy.sendError(`Error occured while adding photo to collage: ${error.message}`);
    }
  }

  resetCollage() {
    this.cache = null;
  }

  getTemplates(directory?: string): string[] {
    logger.info(`Read templates from directory '${directory}'`);
    let directoryTemplates = [];
    if (directory) {
      directoryTemplates = fs
        .readdirSync(directory)
        .filter((template) => fs.statSync(path.join(directory, template)).isDirectory())
        .filter((template) => fs.pathExistsSync(path.join(directory, template, "index.js")));
    }
    return [...directoryTemplates, ...Object.keys(builtInTemplates)];
  }

  resolveTemplate(id: string, directory?: string) {
    if (directory && fs.existsSync(path.join(directory, id))) {
      return require(path.join(directory, id));
    } else if (builtInTemplates[id]) {
      return builtInTemplates[id];
    }
    throw new FotoboxError(
      `Template '${id}' not found. Available are: '${this.getTemplates(directory)}'`,
      "MAIN.COLLAGE-MAKER.TEMPLATE_NOT_FOUND",
    );
  }
}
