const path = require('path');
const { PhotoHandler } = require('../../src/main/photo.handler');
const { Maker } = require('../../src/main/collage-maker/collage-maker');

const photoDir = path.join(__dirname, 'photo_store');

const photosaver = new PhotoHandler();
photosaver.init({ photoDir });

async function run() {
  const collageMaker = new Maker({ photoDir }, { photosaver });
  await collageMaker.initCollage([{
    lines: [
      '   Hochzeit   ',
      'Ute & Lorenz',
    ],
  }], 'default');

  await collageMaker.addPhotoToCollage('kitty.jpg', 0);
  await collageMaker.addPhotoToCollage('deer.jpg', 1);
  await collageMaker.addPhotoToCollage('rabbit.jpg', 2);
  await collageMaker.addPhotoToCollage('giraffe.jpg', 3);
  collageMaker.deinit();
}

run()
  .catch(console.error)
  .then(() => {
    photosaver.deinit();
  })
  .catch(console.error);

