import { ipcMain } from "electron";
import * as fs from "fs-extra";
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
  private clientProxy: ClientProxy;
  private maker: Maker = null;
  private photosaver: PhotoHandler;

  private cache: { template: TemplateInterface; photos: string[] } = null;

  constructor() {
    this.addPhotoToCollage = this.addPhotoToCollage.bind(this);
    this.initCollage = this.initCollage.bind(this);
    this.resetCollage = this.resetCollage.bind(this);
  }

  init(config: CollageMakerConfiguration, externals: { photosaver: PhotoHandler; clientProxy: ClientProxy }) {
    this.maker = new Maker(config);
    this.clientProxy = externals.clientProxy;
    this.photosaver = externals.photosaver;

    ipcMain.on(TOPICS.INIT_COLLAGE, this.initCollage);
    ipcMain.on(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.on(TOPICS.RESET_COLLAGE, this.resetCollage);
  }

  deinit() {
    logger.info("Deinitialize collage maker");
    ipcMain.removeListener(TOPICS.RESET_COLLAGE, this.resetCollage);
    ipcMain.removeListener(TOPICS.CREATE_COLLAGE, this.addPhotoToCollage);
    ipcMain.removeListener(TOPICS.INIT_COLLAGE, this.initCollage);

    this.photosaver = null;
    this.clientProxy = null;
    this.maker = null;
    this.resetCollage();
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
    let directoryTemplates = [];
    if (directory) {
      directoryTemplates = fs
        .readdirSync(directory)
        .filter((template) => fs.statSync(path.join(directory, template)).isDirectory());
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
