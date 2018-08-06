import {Injectable} from '@angular/core';
import {ElectronService} from './electron.service';

export enum FilePickerMode {
  FILE = 'openFile',
  DIRECTORY = 'openDirectory',
}

@Injectable()
export class FilepickerService {
  constructor(private electron: ElectronService) {
  }

  filePicker(mode: FilePickerMode, defaultPath?: string): string {
    const files = this.electron.remote.dialog.showOpenDialog({properties: [mode], defaultPath});
    // nothing selected
    if (!files) {
      return defaultPath;
    }

    return files[0];
  }
}
