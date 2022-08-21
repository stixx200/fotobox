import { Injectable } from "@angular/core";
import { ipcRenderer, OpenDialogOptions, OpenDialogReturnValue, webFrame } from "electron";
import * as fs from "fs";
import { TOPICS } from "../../../shared/constants";
import IpcRenderer = Electron.IpcRenderer;
import WebFrame = Electron.WebFrame;

interface Window {
  process: any;
  electronAPI: {
    ipcRenderer: IpcRenderer;
    webFrame: WebFrame;
    fs: typeof fs;
  };
}

declare var window: Window & typeof globalThis;

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  fs: typeof fs;

  constructor() {
    console.log("Is electron!");
    this.ipcRenderer = window.electronAPI?.ipcRenderer || require("electron").ipcRenderer;
    this.webFrame = window.electronAPI?.webFrame || require("electron").webFrame;

    this.fs = window.electronAPI?.fs || require("fs");
  }

  showOpenDialog(options: OpenDialogOptions): OpenDialogReturnValue {
    return this.ipcRenderer.sendSync(TOPICS.OPEN_DIALOG_SYNC, options);
  }
}
