import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CollageText} from '../../../../../main/collage-maker/template.interface';
import {TOPICS} from '../../../../../main/constants';
import {IpcRendererService} from '../../../providers/ipc.renderer.service';
import {PhotoviewConfiguration} from '../../../shared/photo-view/photo-view.component';

let collagePhoto: string | SafeResourceUrl;

@Component({
  selector: 'app-collage-image',
  templateUrl: './collage-image.component.html',
  styleUrls: ['./collage-image.component.scss']
})
export class CollageImageComponent implements OnInit, OnDestroy {
  photoviewConfiguration: PhotoviewConfiguration = {
    title: 'PRINT_QUESTION',
    buttons: [{
      text: 'YES',
      icon: '',
      callback: () => this.print(),
    }, {
      text: 'NO',
      icon: '',
      callback: () => this.exit(),
    }],
  };

  currentIndex = 0;
  collagePhoto: string | SafeResourceUrl;
  topMessage = 'LAYOUTS.READY';
  collageDone: string;

  @Input() collageTexts: CollageText[];
  @Input() templateId: string;

  constructor(private ipcRenderer: IpcRendererService,
              private _sanitizer: DomSanitizer,
              private router: Router) {
    this.onCollageRendered = this.onCollageRendered.bind(this);
    this.reset = this.reset.bind(this);
  }

  ngOnInit() {
    this.ipcRenderer.on(TOPICS.CREATE_COLLAGE, this.onCollageRendered);
    this.ipcRenderer.send(TOPICS.INIT_COLLAGE, this.templateId, this.collageTexts);
    this.collagePhoto = collagePhoto;
  }

  addPhoto(photo: string) {
    this.ipcRenderer.send(TOPICS.CREATE_COLLAGE, photo, this.currentIndex++);
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(TOPICS.CREATE_COLLAGE, this.onCollageRendered);
    this.collageDone = null;
  }

  print() {
    const errorMessage = this.ipcRenderer.sendSync(TOPICS.PRINT_SYNC, this.collageDone);
    if (errorMessage) {
      console.error(errorMessage);
    } // todo: show toast message with success/fail message
    // exit collage view after printing
    this.exit();
  }

  reset() {
    collagePhoto = null;
    this.collageDone = null;
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
      this.collageDone = collageDone;
    }
  }
}
