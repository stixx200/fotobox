import { Injectable } from "@angular/core";
import { webFrame, ipcRenderer, OpenDialogOptions, OpenDialogReturnValue } from "electron";
import * as fs from "fs";
import { TOPICS } from "../../../shared/constants";
import { pEvent } from "p-event";

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

  async showOpenDialog(options: OpenDialogOptions): Promise<OpenDialogReturnValue> {
    this.ipcRenderer.send(TOPICS.OPEN_DIALOG, options);
    return pEvent(this.ipcRenderer, TOPICS.OPEN_DIALOG_RESULT);
  }
}
