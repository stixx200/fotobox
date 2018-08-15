import {ipcMain} from 'electron';
import {MainApplicationConfiguration, TOPICS} from './constants';
import {CameraProvider} from './cameras/camera.provider';

interface ConfigurationProviderExternals {
  cameraProvider: CameraProvider;
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
      cameraDrivers: this.externals.cameraProvider.getCameraDriverNames(),
    };
  }
}
