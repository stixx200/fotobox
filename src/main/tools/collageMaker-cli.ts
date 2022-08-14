import fs from "fs-extra";
import * as path from "path";
import { Arguments, argv, CamelCaseKey } from "yargs";
import { Maker } from "../collage-maker/maker";

interface ProcessArgs {
  template: string;
  output: string;
}

const argsObj = argv as {
  [key in keyof Arguments<ProcessArgs> as key | CamelCaseKey<key>]: Arguments<ProcessArgs>[key];
};

async function main() {
  const maker = new Maker({ photoDir: process.cwd() });
  const template: any = require(path.resolve(process.cwd(), argsObj.template));
  const collage = await maker.createCollage(template, []);
  await fs.writeFile(argsObj.output || "./collage.png", collage);
}

main().catch(console.error);
