const { CollageMaker: CreateCollage } = require('./collage-maker/index');
const sharp = require('sharp');
require('logger-winston').init({level: 'debug'});

const maker = new CreateCollage();

maker.init({ photoDir: './testdir' }, { shutdownHandler: null });

function done(topic, buffer) {
  sharp(buffer).toFile('./testdir/collage.jpg');
}

maker.createCollage({ sender: { send: done } }, [{ lines: ['beispiel', 'text'] }], ['./testdir/1.jpg'], 'default');
