import { Component, OnInit } from '@angular/core';
import {TOPICS} from '../../../../main/constants';
import {IpcRendererService} from '../../providers/ipc.renderer.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  text = '';
  timeoutHandles: any[] = [];

  constructor(private ipcRenderer: IpcRendererService) { }

  ngOnInit() {
  }

  start() {
    console.log('countdown started');
    this.abort();
    this.text = '3';
    this.timeoutHandles = [
      setTimeout(() => this.text = '2', 1000),
      setTimeout(() => this.text = '1', 2000),
      setTimeout(() => {
        this.abort();
        this.takePicture();
      }, 3000),
    ];
  }

  takePicture() {
    this.ipcRenderer.send(TOPICS.TAKE_PICTURE);
  }

  abort() {
    this.timeoutHandles.forEach((handle) => clearTimeout(handle));
    this.text = '';
  }
}
