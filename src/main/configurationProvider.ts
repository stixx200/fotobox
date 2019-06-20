import {ipcMain} from 'electron';
import {CameraProvider} from './cameras/camera.provider';
import {CollageMaker} from './collage-maker';
import {TOPICS} from './constants';

export interface ConfigurationProviderExternals {
  collageMaker: CollageMaker;
}

export class ConfigurationProvider {
  constructor(private externals: ConfigurationProviderExternals) {
    this.getCameraDrivers = this.getCameraDrivers.bind(this);
    this.getTemplates = this.getTemplates.bind(this);

    ipcMain.on(TOPICS.GET_CAMERA_DRIVERS_SYNC, this.getCameraDrivers);
    ipcMain.on(TOPICS.GET_TEMPLATES_SYNC, this.getTemplates);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.GET_CAMERA_DRIVERS_SYNC, this.getCameraDrivers);
    ipcMain.removeListener(TOPICS.GET_TEMPLATES_SYNC, this.getTemplates);
  }

  getCameraDrivers(event: { returnValue: string[] }) {
    event.returnValue = CameraProvider.getCameraDriverNames();
  }

  getTemplates(event: { returnValue: string[] }, directory: string) {
    event.returnValue = this.externals.collageMaker.getTemplates(directory);
  }
}
