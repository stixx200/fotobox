import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {TOPICS} from '../../../main/constants';
import {IpcRendererService} from './ipc.renderer.service';

@Injectable({
  providedIn: 'root',
})
export class LiveViewService {
  isStarted = false;
  liveViewSubject = new Subject<string>();

  constructor(private ipcRenderer: IpcRendererService) {
    this.onLiveviewImage = this.onLiveviewImage.bind(this);

    this.ipcRenderer.on(TOPICS.LIVEVIEW_DATA, this.onLiveviewImage);
  }

  getLiveView(): Observable<string> {
    return this.liveViewSubject;
  }

  startLiveView() {
    this.ipcRenderer.send(TOPICS.START_LIVEVIEW);
  }

  stopLiveView() {
    this.ipcRenderer.send(TOPICS.STOP_LIVEVIEW);
  }

  onLiveviewImage(event, data: Buffer) {
    this.liveViewSubject.next('data:image/jpg;base64,' + data.toString('base64'));
  }
}
