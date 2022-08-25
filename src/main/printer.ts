const path = require("path");
const fs = require("fs");
import { BrowserWindow, Event, ipcMain, WebContentsPrintOptions } from "electron";
import { TOPICS } from "../shared/constants";
import { PrinterConfiguration } from "../shared/init-configuration.interface";
import { ClientProxy } from "./client.proxy";

const logger = require("logger-winston").getLogger("printer");

export class Printer {
  private photoDir: string;
  private printer: string;

  constructor(private window: BrowserWindow, private clientProxy: ClientProxy) {
    this.getAvailablePrinters = this.getAvailablePrinters.bind(this);
    this.print = this.print.bind(this);
  }

  init(config: PrinterConfiguration) {
    this.photoDir = config.photoDir;
    this.printer = config.printer;

    if (!this.printer) {
      throw new Error("No printer configured!");
    }
    if (!this.photoDir || !fs.lstatSync(this.photoDir).isDirectory()) {
      throw new Error("photoDir is not set or not a directory");
    }
    ipcMain.on(TOPICS.PRINT, this.print);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.PRINT, this.print);
  }

  async getAvailablePrinters() {
    const printers = await this.window.webContents.getPrintersAsync();
    return printers.map((info) => info.name);
  }

  async print(event: Event, photo: string) {
    try {
      await this.internalPrint(photo);
    } catch (error) {
      this.clientProxy.sendError(error.message, "printer");
    }
  }

  async internalPrint(photo: string) {
    logger.info(`Try to print photo: ${photo}`);

    if (!photo) {
      throw new Error("Keine Datei zum drucken verfügbar. Druckvorgang abgebrochen.");
    }

    const filePath = path.resolve(this.photoDir, photo);
    if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
      throw new Error(`Konnte Foto ('${photo}') nicht finden. Druckvorgang abgebrochen.`);
    }

    const printPage = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    await printPage.loadFile(filePath);
    await new Promise<void>((resolve, reject) => {
      const printOptions: WebContentsPrintOptions = {
        silent: true,
        printBackground: true,
        deviceName: this.printer,
        color: true,
        landscape: true,
        pagesPerSheet: 1,
        copies: 1,
      };
      printPage.webContents.print(printOptions, (success, failureReason) => {
        if (!success) {
          logger.error(
            `Failed to print. Reason: ${failureReason}. Print options: ${JSON.stringify(printOptions)}`,
          );
          reject("Drucken war nicht erfolgreich");
        }
        logger.info(`Successfully printed '${filePath}'`);
        resolve();
      });
    });
    printPage.destroy();
  }
}
