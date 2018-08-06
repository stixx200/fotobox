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

  collagePhoto: string | SafeResourceUrl;
  topMessage = 'LAYOUTS.READY';
  collageDone: string;

  @Input() photos: Array<string> = [];

  @Input() collageTexts: CollageText[];
  @Input() templateId: string;

  constructor(private ipcRenderer: IpcRendererService,
              private _sanitizer: DomSanitizer,
              private router: Router) {
    this.onCollageRendered = this.onCollageRendered.bind(this);
  }

  ngOnInit() {
    this.ipcRenderer.on(TOPICS.CREATE_COLLAGE, this.onCollageRendered);
    this.triggerPhotoGeneration();
    this.collagePhoto = collagePhoto;
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(TOPICS.CREATE_COLLAGE, this.onCollageRendered);
  }

  print() {
    const errorMessage = this.ipcRenderer.sendSync(TOPICS.PRINT_SYNC, this.collageDone);
    if (errorMessage) {
      console.error(errorMessage);
    } // todo: show toast message with success/fail message
    // exit collage view after printing
    this.exit();
  }

  exit() {
    this.reset();
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

  private triggerPhotoGeneration() {
    this.ipcRenderer.send(TOPICS.CREATE_COLLAGE, this.collageTexts, this.photos, this.templateId);
  }

  private reset() {
    collagePhoto = null;
    this.collageDone = null;
  }

  // save() {
  //   this.photoChild.addPhoto(this.collagePhoto);
  //   this.reset();
  // }

  // collageDone(collagePath: string) {
  //   console.debug(`Got new collage done: ${collagePath}`);
  //   this.reset();
  //   this.collagePhoto = collagePath;
  // }
}
