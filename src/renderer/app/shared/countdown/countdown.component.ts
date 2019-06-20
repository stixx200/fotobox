import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {TOPICS} from '../../../../main/constants';
import {IpcRendererService} from '../../providers/ipc.renderer.service';
import * as fromApp from '../../store/app.reducer';
import * as fromMainConfiguration from '../../store/mainConfiguration.reducers';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  private intervalHandle: any;

  public text = '';
  public running = false;

  private mainConfigurationState: Observable<fromMainConfiguration.State> = this.store.select('mainConfiguration');

  constructor(private ipcRenderer: IpcRendererService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
  }

  start() {
    let time = 3;
    this.mainConfigurationState.subscribe((state) => {
      time = state.shutterTimeout ? state.shutterTimeout : time;
    });

    console.log(`countdown started with ${time}ms`);
    this.abort();
    this.running = true;
    this.text = `${time}`;
    this.intervalHandle = setInterval(() => {
      const curNumber = (+this.text) - 1;
      if (!curNumber) {
        this.abort();
        this.takePicture();
      } else {
        this.text = `${curNumber}`;
      }
    }, 1000);
  }

  abort() {
    clearTimeout(this.intervalHandle);
    this.text = '';
    this.running = false;
  }

  private takePicture() {
    this.ipcRenderer.send(TOPICS.TAKE_PICTURE);
  }
}
