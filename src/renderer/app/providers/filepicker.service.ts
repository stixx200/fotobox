import { Injectable } from "@angular/core";
import { ElectronService } from "./electron.service";

export enum FilePickerMode {
  FILE = "openFile",
  DIRECTORY = "openDirectory",
}

@Injectable()
export class FilepickerService {
  constructor(private electron: ElectronService) {}

  filePicker(mode: FilePickerMode, defaultPath?: string): string {
    const { filePaths } = this.electron.showOpenDialog({ properties: [mode], defaultPath });
    // nothing selected
    if (!filePaths) {
      return defaultPath;
    }

    return filePaths[0];
  }
}
