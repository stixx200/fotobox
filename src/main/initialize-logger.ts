import * as fs from "fs-extra";
import * as logging from "logger-winston";
import { homedir } from "os";
import * as path from "path";

const logdir = process.env.LOG_DIR || homedir() || process.cwd();
const logfilePath = path.join(logdir, "fotobox", "application.log");
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
