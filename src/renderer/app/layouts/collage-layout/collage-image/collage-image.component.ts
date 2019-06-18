import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {TOPICS} from '../../../../../main/constants';
import {IpcRendererService} from '../../../providers/ipc.renderer.service';

let collagePhoto: string | SafeResourceUrl;

@Component({
  selector: 'app-collage-image',
  templateUrl: './collage-image.component.html',
  styleUrls: ['./collage-image.component.scss']
})
export class CollageImageComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  collagePhoto: string | SafeResourceUrl;

  @Output() done = new EventEmitter<string>();
  @Input() templateId: string;

  constructor(private ipcRenderer: IpcRendererService,
              private _sanitizer: DomSanitizer,
              private router: Router) {
    this.onCollageRendered = this.onCollageRendered.bind(this);
    this.reset = this.reset.bind(this);
  }

  ngOnInit() {
    console.log(`initializing template: ${this.templateId}`);
    this.ipcRenderer.on(TOPICS.CREATE_COLLAGE, this.onCollageRendered);
    this.ipcRenderer.send(TOPICS.INIT_COLLAGE, this.templateId);
    this.collagePhoto = collagePhoto;
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(TOPICS.CREATE_COLLAGE, this.onCollageRendered);
  }

  addPhoto(photo: string) {
    this.ipcRenderer.send(TOPICS.CREATE_COLLAGE, photo, this.currentIndex++);
  }

  reset() {
    collagePhoto = null;
  }

  exit() {
    this.router.navigate(['/home']);
  }

  private onCollageRendered(event, data: any, collageDone: string) {
    if (_.isString(data)) {
      this.collagePhoto = `url(photo://${data})`;
    } else {
      this.collagePhoto = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data.toString('base64'));
    }
    collagePhoto = this.collagePhoto;

    if (collageDone) {
      this.reset();
      this.done.emit(collageDone);
    }
  }
}
