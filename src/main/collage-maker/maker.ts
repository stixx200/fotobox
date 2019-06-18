const sharp = require('sharp');
const path = require('path');
import {calculateWidthHeight} from './helper';
import {TemplateLoader} from './template-loader';
import {Space, TemplateInterface} from './template.interface';

const questionmarkPhoto = path.resolve(__dirname, './images/questionmark.png');
const defaultBackgroundPhoto = path.resolve(__dirname, './images/default-background.jpg');

export class Maker {
  /**
   * Creates a new collage and returns the buffer.
   * @param template The template used to create the collage.
   * @param photos List of photos. According to the template, the max. length of the array is given.
   */
  async createCollage(template: TemplateInterface, photos: string[] = []) {
    const templateLoader = new TemplateLoader(template);

    // create overlay photos
    const composites = await this.createComposites(templateLoader, photos);

    const {contentSize, border} = templateLoader.getPhotoSizes();
    let result;
    try {
      let sharpInstance = sharp(
        templateLoader.getBackground() || defaultBackgroundPhoto,
      ).resize(contentSize);
      if (border) {
        sharpInstance = sharpInstance.extend(border);
      }
      result = await sharpInstance
        .composite(composites)
        .jpeg()
        .toBuffer();
    } catch (error) {
      throw new Error(`Failed to create collage: ${error.message}`);
    }
    return result;
  }

  private createComposites(templateLoader: TemplateLoader, photos: string[]) {
    return Promise.all(
      templateLoader
        .getComposites()
        .map(async (space: Space, index: number) => {
          const photoToAdd = photos[index] || questionmarkPhoto;
          try {
            return this.createComposite(photoToAdd, space);
          } catch (error) {
            throw new Error(`Can't add ${photoToAdd}: ${error.message}`);
          }
        }),
    );
  }

  private async createComposite(photoToAdd: string, space: Space) {
    const {width, height} = calculateWidthHeight(
      space.width,
      space.height,
      space.border,
    );
    let input = sharp(photoToAdd)
      .png()
      .resize(width, height, {fit: 'inside'});
    if (space.border) {
      input = input.extend(space.border);
    }
    input = await input.toBuffer();

    if (space.rotation) {
      input = await sharp(input)
        .rotate(space.rotation, {
          background: {r: 0, g: 0, b: 0, alpha: 0},
        })
        .toBuffer();
      input = await sharp(input)
        .resize(width, height, {fit: 'inside'})
        .toBuffer();
    }
    return {
      input,
      top: space.y,
      left: space.x,
    };
  }
}
