import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {TOPICS} from '../../../main/constants';
import {IpcRendererService} from './ipc.renderer.service';

@Injectable({
  providedIn: 'root',
})
export class LiveViewService {
  isStarted = false;
  liveViewSubject = new BehaviorSubject<string>('../../../assets/app-background.jpg');

  constructor(private ipcRenderer: IpcRendererService) {
    this.onLiveviewImage = this.onLiveviewImage.bind(this);

    this.ipcRenderer.on(TOPICS.LIVEVIEW_DATA, this.onLiveviewImage);
  }

  getLiveView(): Observable<string> {
    return this.liveViewSubject;
  }

  startLiveView() {
    if (!this.isStarted) {
      this.ipcRenderer.send(TOPICS.START_LIVEVIEW);
      this.isStarted = true;
    }
  }

  stopLiveView() {
    if (this.isStarted) {
      this.ipcRenderer.send(TOPICS.STOP_LIVEVIEW);
      this.isStarted = false;
    }
  }

  onLiveviewImage(event, data: Buffer) {
    this.liveViewSubject.next('data:image/jpg;base64,' + data.toString('base64'));
  }
}
