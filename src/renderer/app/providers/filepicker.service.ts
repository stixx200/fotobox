import { Injectable } from "@angular/core";
import { ElectronService } from "./electron.service";

export enum FilePickerMode {
  FILE = "openFile",
  DIRECTORY = "openDirectory",
}

@Injectable()
export class FilepickerService {
  constructor(private electron: ElectronService) {}

  async filePicker(mode: FilePickerMode, defaultPath?: string): Promise<string> {
    const { filePaths } = await this.electron.showOpenDialog({ properties: [mode], defaultPath });
    // nothing selected
    if (!filePaths) {
      return defaultPath;
    }

    return filePaths[0];
  }
}
