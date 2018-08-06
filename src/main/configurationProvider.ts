import {ipcMain} from 'electron';
import {MainApplicationConfiguration, TOPICS} from './constants';
import {CameraProvider} from './cameras/camera.provider';

interface ConfigurationProviderExternals {
  cameraProvider: CameraProvider;
}

export class ConfigurationProvider {
  constructor(private externals: ConfigurationProviderExternals) {
    ipcMain.on(TOPICS.GET_APP_CONFIG_SYNC, (event: { returnValue: MainApplicationConfiguration}) => this.sendConfiguration(event));
  }

  sendConfiguration(event: { returnValue: MainApplicationConfiguration }) {
    event.returnValue = {
      cameraDrivers: this.externals.cameraProvider.getCameraDriverNames(),
    };
  }
}
