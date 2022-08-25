import { ipcMain } from "electron";
import { TOPICS } from "../shared/constants";
import { CameraProvider } from "./cameras/camera.provider";
import { CollageMaker } from "./collage-maker";
import { Printer } from "./printer";

export interface ConfigurationProviderExternals {
  collageMaker: CollageMaker;
  printer: Printer;
}

export class ConfigurationProvider {
  constructor(private externals: ConfigurationProviderExternals) {
    this.getCameraDrivers = this.getCameraDrivers.bind(this);
    this.getTemplates = this.getTemplates.bind(this);
    this.getAvailablePrinters = this.getAvailablePrinters.bind(this);

    ipcMain.on(TOPICS.GET_CAMERA_DRIVERS_SYNC, this.getCameraDrivers);
    ipcMain.on(TOPICS.GET_TEMPLATES_SYNC, this.getTemplates);
    ipcMain.on(TOPICS.GET_AVAILABLE_PRINTERS_SYNC, this.getAvailablePrinters);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.GET_AVAILABLE_PRINTERS_SYNC, this.getAvailablePrinters);
    ipcMain.removeListener(TOPICS.GET_CAMERA_DRIVERS_SYNC, this.getCameraDrivers);
    ipcMain.removeListener(TOPICS.GET_TEMPLATES_SYNC, this.getTemplates);
  }

  getCameraDrivers(event: { returnValue: string[] }) {
    event.returnValue = CameraProvider.getCameraDriverNames();
  }

  getTemplates(event: { returnValue: string[] }, directory?: string) {
    event.returnValue = this.externals.collageMaker.getTemplates(directory);
  }

  async getAvailablePrinters(event: { returnValue: string[] }) {
    event.returnValue = await this.externals.printer.getAvailablePrinters();
  }
}
