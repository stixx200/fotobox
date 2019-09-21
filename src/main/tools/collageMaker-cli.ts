import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';
import {argv} from 'yargs';
import {Maker} from '../collage-maker/maker';

const writeFile = promisify(fs.writeFile);

async function main() {
  const maker = new Maker({photoDir: process.cwd()});
  const template: any = require(path.resolve(process.cwd(), argv.template));
  const collage = await maker.createCollage(template, []);
  await writeFile(argv.output || './collage.png', collage);
}

main().catch(console.error);
