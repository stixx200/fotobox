import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { TOPICS } from "../../../shared/constants";
import { IpcRendererService } from "./ipc.renderer.service";

@Injectable({
  providedIn: "root",
})
export class LiveViewService {
  liveViewSubject = new Subject<string>();

  constructor(private ipcRenderer: IpcRendererService) {
    this.onLiveviewImage = this.onLiveviewImage.bind(this);

    this.ipcRenderer.on(TOPICS.LIVEVIEW_DATA, this.onLiveviewImage);
  }

  getLiveView(): Observable<string> {
    return this.liveViewSubject;
  }

  onLiveviewImage(event, data: Buffer) {
    this.liveViewSubject'data:image/jpg;base64,'se64," + Buffer.from(data).toS'base64'ase64"));
  }
}
