import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {TOPICS} from '../../../../main/constants';
import {IpcRendererService} from '../../providers/ipc.renderer.service';
import {PhotoviewConfiguration} from '../../shared/photo-view/photo-view.component';

import * as fromApp from '../../store/app.reducer';
import {CollageImageComponent} from './collage-image/collage-image.component';
import * as fromCollage from './store/collage-layout.reducer';
import {CountdownComponent} from '../../app/countdown/countdown.component';

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

  @ViewChild('imageComponent') collageComponent: CollageImageComponent;
  @ViewChild('countdown') countdown: CountdownComponent;

  collageState: Observable<fromCollage.State>;
  photos: string[];
  currentPhoto: string;
  topMessage = 'LAYOUTS.READY_TAKE_PICTURE';
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
    this.collageComponent.reset();
    this.ipcRenderer.removeListener('photo', this.onNewPhoto);
  }

  reset() {
    this.photos = [];
    this.currentPhoto = null;
    this.ipcRenderer.send(TOPICS.RESET_COLLAGE);
    if (this.countdown) {
      this.countdown.abort();
    }
  }

  exit() {
    this.reset();
    this.router.navigate(['/home']);
  }

  takePicture() {
    if (!this.currentPhoto) {
      console.log('Trigger picture creation');
      this.countdown.start();
    }
  }

  private onNewPhoto(event: Event, photoUrl: string) {
    console.info('Show photo and check if it should be added to collage: ' + photoUrl);
    this.currentPhoto = photoUrl;
  }

  private useCurrentPhoto() {
    this.collageComponent.addPhoto(this.currentPhoto);
    this.currentPhoto = null;
  }
}
