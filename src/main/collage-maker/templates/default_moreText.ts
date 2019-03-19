import {TemplateInterface, TEXT_ALIGN} from '../template.interface';

const resizeFactor = 0.88;

const resizeValues = {
  a: resizeFactor,
  s: 1 - resizeFactor,
};

const template: TemplateInterface = {
  id: 'Default Template',
  total_width: 1776,
  total_height: 1200,
  // background: path.resolve(__dirname, '../background.jpg'),
  border: {
    colors: {r: 255, g: 255, b: 255},
    top: 4,
    bottom: 4,
    left: 4,
    right: 4,
  },
  spaces: [{
    type: 'text',
    description: 'Textfeld Reihe 1 links',
    width: 500,
    height: 800,
    x: 20,
    y: 0,
    style: {
      padding: 0,
      textColor: '#5e2028',
      lineSpacing: 20,
      fontSize: 110,
      textAlign: TEXT_ALIGN.CENTER,
    },
  }, {
    type: 'photo',
    description: 'Foto Reihe 1 rechts',
    width: 1300 * resizeValues.a,
    height: 800 * resizeValues.a,
    x: 456 + 1300 * resizeValues.s,
    y: 20 + 15,
    style: {
      padding: 50,
      rotation: 5,
      'border-radius': 5,
    },
  }, {
    type: 'photo',
    description: 'Foto Reihe 2 links',
    width: 600,
    height: 400,
    x: 20,
    y: 790 - 800 * resizeValues.s,
    style: {
      padding: 50,
      rotation: 355,
      'border-radius': 2,
    },
  }, {
    type: 'photo',
    description: 'Foto Reihe 2 mitte',
    width: 600,
    height: 400,
    x: 588,
    y: 790 - 800 * resizeValues.s,
    style: {
      padding: 50,
      rotation: 4,
      'border-radius': 2,
    },
  }, {
    type: 'photo',
    description: 'Foto Reihe 2 rechts',
    width: 600,
    height: 400,
    x: 1156,
    y: 790 - 800 * resizeValues.s,
    style: {
      padding: 50,
      rotation: 358,
      'border-radius': 2,
    },
  }],
};

export default template;
