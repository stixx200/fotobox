import {ipcMain} from 'electron';
import {CameraProvider} from './cameras/camera.provider';
import {CollageMaker} from './collage-maker';
import {MainApplicationConfiguration, TOPICS} from './constants';

export interface ConfigurationProviderExternals {
  cameraProvider: CameraProvider;
  collageMaker: CollageMaker;
}

export class ConfigurationProvider {
  constructor(private externals: ConfigurationProviderExternals) {
    this.sendConfiguration = this.sendConfiguration.bind(this);

    ipcMain.on(TOPICS.GET_APP_CONFIG_SYNC, this.sendConfiguration);
  }

  deinit() {
    ipcMain.removeListener(TOPICS.GET_APP_CONFIG_SYNC, this.sendConfiguration);
  }

  sendConfiguration(event: { returnValue: MainApplicationConfiguration }) {
    event.returnValue = {
      cameraDrivers: CameraProvider.getCameraDriverNames(),
      templates: this.externals.collageMaker.getTemplates(),
    };
  }
}
