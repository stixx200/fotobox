import {TemplateInterface, TEXT_ALIGN} from '../../template.interface';

const template: TemplateInterface = {
  id: 'Default Template',
  total_width: 1800,
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
    x: 0,
    y: 0,
    style: {
      padding: 50,
      textColor: '#5e2028',
      lineSpacing: 50,
      fontSize: 130,
      textAlign: TEXT_ALIGN.CENTER,
    },
  }, {
    type: 'photo',
    description: 'Foto Reihe 1 rechts',
    width: 1300,
    height: 800,
    x: 500,
    y: 0,
    style: {
      padding: 30,
      rotation: 5,
      'border-radius': 5,
    },
  }, {
    type: 'photo',
    description: 'Foto Reihe 2 links',
    width: 600,
    height: 400,
    x: 0,
    y: 800,
    style: {
      padding: 30,
      rotation: 355,
      'border-radius': 2,
    },
  }, {
    type: 'photo',
    description: 'Foto Reihe 2 mitte',
    width: 600,
    height: 400,
    x: 600,
    y: 800,
    style: {
      padding: 30,
      rotation: 4,
      'border-radius': 2,
    },
  }, {
    type: 'photo',
    description: 'Foto Reihe 2 rechts',
    width: 600,
    height: 400,
    x: 1200,
    y: 800,
    style: {
      padding: 30,
      rotation: 358,
      'border-radius': 2,
    },
  }],
};

export default template;
