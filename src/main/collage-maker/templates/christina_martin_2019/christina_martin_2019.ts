import {Border, PhotoSpace, TemplateInterface} from 'collage-maker';
import * as path from 'path';

const aspectRatio = 3 / 2;
const photoBorder: Border = {
  background: {r: 255, g: 255, b: 255},
  top: 4,
  bottom: 4,
  left: 4,
  right: 4,
};

const total_border: Border = {
  background: {r: 255, g: 255, b: 255, alpha: 1},
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};
const width = 1796;
const height = 1204;
const borderDistance = Math.ceil(width * 0.02);
const lineDistance = Math.ceil(width * 0.01);

const bigPhotoHeight = Math.floor(0.6 * height);
const bigPhotoWidth = Math.floor(bigPhotoHeight * aspectRatio);
const bigPhoto: PhotoSpace = {
  type: 'photo',
  width: bigPhotoWidth,
  height: bigPhotoHeight,
  y: total_border.top + borderDistance,
  x: width - bigPhotoWidth - borderDistance - total_border.right,
};

const smallPhotoHeight =
  height -
  photoBorder.top -
  photoBorder.bottom -
  2 * borderDistance -
  bigPhoto.height -
  lineDistance;
const smallPhoto: PhotoSpace = {
  type: 'photo',
  width: Math.floor(smallPhotoHeight * aspectRatio),
  height: smallPhotoHeight,
  y: photoBorder.top + borderDistance + bigPhoto.height + lineDistance,
  border: photoBorder,
  x: null,
};
const smallPhotoHorizontalDistance =
  (width -
    total_border.left -
    total_border.right -
    2 * borderDistance -
    3 * smallPhoto.width) /
  2;
const calculateXForSmallPhoto = i =>
  Math.floor(
    total_border.left +
    borderDistance +
    i * (smallPhoto.width + smallPhotoHorizontalDistance),
  );

const template: TemplateInterface = {
  id: 'Default Template',
  width,
  height,
  border: total_border,
  background: path.join(__dirname, 'background.jpg'),
  spaces: [
    {
      ...bigPhoto,
      rotation: 2,
      border: photoBorder,
    },
    {
      ...smallPhoto,
      x: calculateXForSmallPhoto(0),
      rotation: 355,
    },
    {
      ...smallPhoto,
      x: calculateXForSmallPhoto(1),
      rotation: 4,
    },
    {
      ...smallPhoto,
      x: calculateXForSmallPhoto(2),
      rotation: 358,
    },
  ],
};

export default template;
