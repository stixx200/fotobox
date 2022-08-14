import * as fs from "fs-extra";
import * as logging from "logger-winston";
import { homedir } from "os";
import * as path from "path";

const pkg = require("../../package");
const logdir = process.env.LOG_DIR || homedir() || process.cwd();
const logfilePath = path.join(logdir, `${pkg.name}_${pkg.version}`, "application.log");
fs.ensureDirSync(path.dirname(logfilePath));
logging.init({
  logging: {
    default: {
      console: {
        level: "info",
        colorize: true,
        timestamp: true,
      },
      file: {
        level: "debug",
        timestamp: true,
        filename: logfilePath,
        json: false,
      },
    },
  },
});
