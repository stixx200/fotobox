import { Injectable} from '@angular/core';
import * as childProcess from 'child_process';
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {remote, webFrame} from 'electron';
import * as fs from 'fs';
import {DummyIpcRenderer} from './dummyServer';

@Injectable()
export class ElectronService {
  ipcRenderer: any = new DummyIpcRenderer();
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  isElectron() {
    return window && window.process && window.process.type;
  }

  constructor() {
    if (this.isElectron()) {
      console.log('Is electron!');
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }
}
