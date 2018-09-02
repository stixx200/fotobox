import {CollageText, TEXT_ALIGN} from './template.interface';

const logger = require('logger-winston').getLogger('collage-maker.text-helper');
const sharp = require('sharp');

function getCenterAdditions(container: { width: number }, toAdd: { width: number, height: number }, spaceing: number = 0) {
  const difference = Math.abs((toAdd.width - container.width) / 2);
  let sideAddition = 0;
  let overlayPadding = 0;
  if (toAdd.width > container.width) {
    sideAddition = difference;
  } else {
    overlayPadding = difference;
  }
  const bottomAddition = toAdd.height + spaceing;
  return {
    sideAddition,
    overlayPadding,
    bottomAddition,
  };
}

function getLeftAdditions(container: { width: number }, toAdd: { width: number, height: number }, spaceing: number = 0) {
  const difference = Math.abs((toAdd.width - container.width) / 2);
  const sideAddition = toAdd.width > container.width ? difference : 0;
  const bottomAddition = toAdd.height + spaceing;
  return {
    sideAddition,
    overlayPadding: 0,
    bottomAddition,
  };
}

function getAdditions(type: TEXT_ALIGN = TEXT_ALIGN.CENTER, container: { width: number }, toAdd: { width: number, height: number }, spaceing: number = 0) { // tslint:disable-line max-line-length
  switch (type) {
    case TEXT_ALIGN.CENTER:
      return getCenterAdditions(container, toAdd, spaceing);
    case TEXT_ALIGN.LEFT:
      return getLeftAdditions(container, toAdd, spaceing);
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export async function getText(text: CollageText, space: any, padding: { paddingLeft: number, paddingTop: number }, fontedText: any) {
  const spaceing = space.style.lineSpacing || 0;

  const options = {
    x: 0,
    y: 0,
    fontSize: space.style.fontSize || 120,
    anchor: 'top',
    attributes: {
      fill: space.style.textColor || '#5e2028',
      stroke: 'white',
      'stroke-width': '1',
    },
  };

  const svgLines = text.lines.map((line) => fontedText.getSVG(line, options));
  const sharpLines = svgLines.map((line) => sharp(new Buffer(line)));

  let container = await sharpLines[0].toBuffer({resolveWithObject: true});
  logger.debug('first');
  logger.debug(container.info);

  for (let i = 1; i < svgLines.length; ++i) {
    let sharpContainer = sharp(container.data);
    const lineToAdd = sharpLines[i];
    const lineToAddMetaData = await
      lineToAdd.metadata();
    logger.debug('toAdd');
    logger.debug(lineToAddMetaData);
    const additions = getAdditions(space.style.textAlign, container.info, lineToAddMetaData, spaceing);

    logger.debug('extend side: ' + additions.sideAddition + 'bottom: ' + lineToAddMetaData.height);

    sharpContainer = sharpContainer
      .background({r: 0, g: 0, b: 0, alpha: 0})
      .extend({
        top: 0,
        bottom: additions.bottomAddition,
        left: additions.sideAddition,
        right: additions.sideAddition,
      });
    const lineToAddBuffer = await
      lineToAdd.toBuffer();
    container = await
      sharpContainer.overlayWith(lineToAddBuffer, {
        left: Math.round(additions.overlayPadding),
        top: Math.round(container.info.height + spaceing),
      }).toBuffer({resolveWithObject: true});
    logger.debug('second');
    logger.debug(container.info);
  }

  const plusWidth = container.info.width < space.width ? (space.width - container.info.width) / 2 : 0;
  const plusHeight = container.info.height < space.height ? (space.height - container.info.height) / 2 : 0;
  const x = space.x + padding.paddingLeft + plusWidth;
  const y = space.y + padding.paddingTop + plusHeight;

  return {
    info: {
      ...container.info,
      x,
      y,
    },
    data: container.data,
  };
}
