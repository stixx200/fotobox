import * as logging from 'logger-winston';
import * as path from 'path';
import * as fs from 'fs-extra';
import { homedir } from 'os';

const pkg = require('../../package');
const logdir = process.env.LOG_DIR || homedir() || process.cwd();
const logfilePath = path.join(logdir, `${pkg.name}_${pkg.version}`, 'application.log');
fs.ensureDirSync(path.dirname(logfilePath));
logging.init({
  logging: {
    default: {
      console: {
        level: 'info',
        colorize: true,
        timestamp: true,
      },
      file: {
        level: 'debug',
        timestamp: true,
        filename: logfilePath,
        json: false,
      },
    },
  },
});
