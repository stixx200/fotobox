import {Border, CollageText, SpaceStyle, TemplateInterface} from './template.interface';
import * as path from 'path';
import * as TextToSVG from 'text-to-svg';
import * as _ from 'lodash';
const logger = require('logger-winston').getLogger('collage-maker.template-loader');
import * as sharp from 'sharp';
import * as helper from './text.helper';

// const DEFAULT_FONT = './Balqis.otf';
const DEFAULT_FONT = './blackjack.otf';
const DEFAULT_BACKGROUND = './background.jpg';

interface SpaceElement {
  info: { x: number, y: number };
  data: Buffer;
}

export class TemplateLoader {
  private fontedText: any;

  constructor(private template: TemplateInterface) {
    const fontPath = path.join(__dirname, this.template.font || DEFAULT_FONT); // use __dirname. This works in dev and prod env
    this.fontedText = TextToSVG.loadSync(fontPath);
  }

  getBrands() {
    const brand = _.find(this.template.spaces, ['type', 'brand']);
    if (brand) {
      return brand.value;
    }
    return null;
  }

  async getEmptyCollage(texts: CollageText[], photoToFill: string): Promise<Buffer> {
    const collageBuffer = await this.getBackground();
    const photos = _.fill(Array(this.template.spaces.length), photoToFill);
    const spaces = await this.getSpaces(texts, photos, null);
    return this.createCollage(collageBuffer, spaces);
  }

  async addPhotoToCollage(buffer: Buffer, photoToAdd: string, index: number): Promise<{ buffer: Buffer, done: boolean }> {
    const spaceIndex = this.getAbsoluteIndexForTypeIndex(index, 'photo');
    const photoImage = await this.getPhoto(spaceIndex, photoToAdd);
    return {
      buffer: await this.createCollage(buffer, [photoImage]),
      done: this.getPhotos().length <= (index + 1),
    };
  }

  private getAbsoluteIndexForTypeIndex(index: number, type: string): number {
    let itemNr = 0;
    return _.findIndex(this.template.spaces, (space) => {
      if (space.type !== type) {
        return false;
      }
      if (itemNr === index) {
        return true;
      }
      itemNr += 1;
    });
  }

  private getPhotos() {
    return _.filter(this.template.spaces, ['type', 'photo']);
  }

  private getSpaces(_texts: CollageText[], _photoUrls: string[], brandUrl: string): Promise<SpaceElement[]> {
    const texts = _texts.slice(0);
    const photoUrls = _photoUrls.slice(0);
    const spaces = _.map(this.template.spaces, (space, index: number) => {
      if (space.type === 'text') {
        const text = texts.shift();
        logger.debug(`Adding text to spaces: ${JSON.stringify(text)}`);
        return this.getText(index, text);
      } else if (space.type === 'photo') {
        const photoUrl = photoUrls.shift();
        logger.debug(`Adding photo to spaces: ${photoUrl}`);
        return this.getPhoto(index, photoUrl);
      } else if (space.type === 'brand') {
        logger.debug(`Adding brand to spaces: ${brandUrl}`);
        return this.getBrand(index, brandUrl);
      }
      return null;
    });

    return Promise.resolve(_.compact(spaces))
      .then((_spaces: SpaceElement[]) => Promise.all(_spaces));
  }

  private getBackground(): Promise<Buffer> {
    return this.getScaled(path.join(__dirname, this.template.background || DEFAULT_BACKGROUND),
      this.template.total_width,
      this.template.total_height)
      .then(obj => obj.data);
  }

  private async createCollage(collage: Buffer, spaceElements: SpaceElement[]): Promise<Buffer> {
    for (let i = 0; i < spaceElements.length; ++i) {
      const elem = spaceElements[i];
      collage = await this.overlay(collage, elem.data, elem.info.x, elem.info.y);
    }
    return collage;
  }

  private getSpace(index: number, type: string) {
    if (index >= this.template.spaces.length) {
      throw new Error(`Invalid index. Passed: ${index} max: ${this.template.spaces.length - 1}`);
    }
    const element = this.template.spaces[index];
    if (element.type !== type) {
      throw new Error(`Got index '${index}'. Type of this space is: '${element.type}' but expected was '${type}'`);
    }
    element.style = element.style || {};
    return element;
  }

  private getPadding(style: SpaceStyle) {
    return {
      paddingLeft: style.padding || style.paddingLeft || 0,
      paddingRight: style.padding || style.paddingRight || 0,
      paddingTop: style.padding || style.paddingTop || 0,
      paddingBottom: style.padding || style.paddingBottom || 0,
    };
  }

  private async getText(index: number, text: CollageText): Promise<SpaceElement> {
    logger.debug(`Format text: ${JSON.stringify(text)}`);
    const space = this.getSpace(index, 'text');
    const padding = this.getPadding(space.style);
    return helper.getText(text, space, padding, this.fontedText);
  }

  private async getPhoto(index: number, url: string): Promise<SpaceElement> {
    logger.debug(`Format photo: ${JSON.stringify(url)}`);
    const space = this.getSpace(index, 'photo');
    const {paddingLeft, paddingRight, paddingTop, paddingBottom} = this.getPadding(space.style);

    const width = space.width - paddingLeft - paddingRight;
    const height = space.height - paddingTop - paddingBottom;

    const scaledImage: { info: any, data: Buffer } = await this.getScaled(url, width, height, this.template.border);

    const retVal = {
      info: {
        ...scaledImage.info,
        x: space.x + paddingLeft,
        y: space.y + paddingTop,
      },
      data: scaledImage.data,
    };
    logger.debug(`Photo ${index}: paddingLeft: ${paddingLeft}, paddingRight: ${paddingRight}, paddingTop: ${paddingTop}, paddingBottom: ${paddingBottom}, width: ${width}, height: ${height}, x: ${retVal.info.x}, y: ${retVal.info.y}`); // tslint:disable-line max-line-length
    return retVal;
  }

  private async getBrand(index: number, url: string): Promise<SpaceElement> {
    logger.debug(`Format photo: ${JSON.stringify(url)}`);
    const space = this.getSpace(index, 'brand');
    const {paddingLeft, paddingRight, paddingTop, paddingBottom} = this.getPadding(space.style);

    const width = space.width - paddingLeft - paddingRight;
    const height = space.height - paddingTop - paddingBottom;

    const scaledImage: { info: any, data: Buffer } = await this.getScaled(url, width, height);
    return {
      info: {
        ...scaledImage.info,
        x: space.x + paddingLeft,
        y: space.y + paddingTop,
      },
      data: scaledImage.data,
    };
  }

  private getScaled(picture: string, width: number, height: number, border?: Border): Promise<{ info: any, data: Buffer }> {
    const picturePath = picture.replace('app.asar', 'app.asar.unpacked');
    logger.debug(`picturePath: ${picturePath}`);
    let obj = sharp(picturePath).resize(width, height);
    if (border) {
      obj = obj.background(border.colors).extend(border);
    }
    return obj.toBuffer({resolveWithObject: true});
  }

  private async overlay(current: Buffer, toOverlay: Buffer, x_offset: number, y_offset: number): Promise<Buffer> {
    return sharp(current).overlayWith(toOverlay, {
      left: Math.round(x_offset),
      top: Math.round(y_offset),
    }).toBuffer();
  }
}
