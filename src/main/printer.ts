const path = require("path");
const fs = require("fs");

import { execFile } from "child_process";
import { Event, ipcMain } from "electron";
import { TOPICS } from "../shared/constants";
import { PrinterConfiguration } from "../shared/init-configuration.interface";

const logger = require("logger-winston").getLogger("printer");

export class Printer {
  private photoDir: string;
  private irfanViewPath: string;

  constructor() {
    this.print = this.print.bind(this);
  }

  init(config: PrinterConfiguration) {
    this.photoDir = config.photoDir;
    this.irfanViewPath = config.irfanViewPath;

    if (!this.irfanViewPath || !fs.lstatSync(this.irfanViewPath).isFile()) {
      throw new Error("Can't find 'irfanview.exe'.'");
    }
    if (!this.photoDir || !fs.lstatSync(this.photoDir).isDirectory()) {
      throw new Error("photoDir is not set or not a directory");
    }
    ipcMain.on(TOPICS.PRINT_SYNC, this.print);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.PRINT_SYNC, this.print);
  }

  print(event: Event, photo: string) {
    logger.info(`Try to print photo: ${photo}`);

    if (!photo) {
      const msg = "Keine Datei zum drucken verfügbar. Druckvorgang abgebrochen.";
      logger.error(msg);
      return (event.returnValue = msg);
    }

    const filePath = path.resolve(this.photoDir, photo);
    if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
      const msg = `Konnte Foto ('${photo}') nicht finden. Druckvorgang abgebrochen.`;
      logger.error(msg);
      return (event.returnValue = msg);
    }

    execFile(this.irfanViewPath, [filePath, "/print"], (error: Error) => {
      if (error) {
        logger.error("exec error", error);
        return;
      }
      logger.info(`Printed ${filePath} successfully`);
    });
    event.returnValue = null;
  }
}
