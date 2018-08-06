import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {TOPICS} from '../../../../main/constants';
import {IpcRendererService} from '../../providers/ipc.renderer.service';
import {PhotoviewConfiguration} from '../../shared/photo-view/photo-view.component';

import * as fromApp from '../../store/app.reducer';
import * as fromCollage from './store/collage-layout.reducer';

@Component({
  selector: 'app-collage-layout',
  templateUrl: './collage-layout.component.html',
  styleUrls: ['./collage-layout.component.scss'],
})
export class CollageLayoutComponent implements OnInit, OnDestroy {
  photoviewConfiguration: PhotoviewConfiguration = {
    title: 'USE_QUESTION',
    buttons: [{
      text: 'YES',
      icon: '',
      callback: () => this.useCurrentPhoto(),
    }, {
      text: 'NO',
      icon: '',
      callback: () => (this.currentPhoto = null),
    }],
  };

  collageState: Observable<fromCollage.State>;
  photos: string[];
  currentPhoto: string;
  bottomMessage = 'LAYOUTS.ABORT';

  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private ipcRenderer: IpcRendererService) {
    this.onNewPhoto = this.onNewPhoto.bind(this);
  }

  ngOnInit() {
    console.debug('Initialize collage component');
    this.reset();
    this.collageState = this.store.select('collageLayout');
    this.ipcRenderer.on(TOPICS.PHOTO, this.onNewPhoto);
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener('photo', this.onNewPhoto);
  }

  reset() {
    this.photos = [];
    this.currentPhoto = null;
  }

  exit() {
    this.reset();
    this.router.navigate(['/home']);
  }

  private onNewPhoto(event: Event, photoUrl: string) {
    console.info('Show photo and check if it should be added to collage: ' + photoUrl);
    this.currentPhoto = photoUrl;
  }

  private useCurrentPhoto() {
    this.photos.push(this.currentPhoto);
    this.currentPhoto = null;
  }

  // print() {
  //   const errorMessage = this.ipcRenderer.sendSync(TOPICS.PRINT_SYNC, this.currentPhoto);
  //   if (errorMessage) {
  //     console.error(errorMessage);
  //   } // todo: show toast message with success/fail message
  //   // exit collage view after printing
  //   this.exit();
  // }

  // save() {
  //   this.photoChild.onNewPhoto(this.currentPhoto);
  //   this.reset();
  // }
}
