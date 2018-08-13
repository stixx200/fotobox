import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {TOPICS} from '../../../../main/constants';
import {AppConfig} from '../../../environments/environment';
import * as fromCollageLayout from '../../layouts/collage-layout/store/collage-layout.reducer';
import * as fromSingleLayout from '../../layouts/single-layout/store/single-layout.reducer';
import {IpcRendererService} from '../../providers/ipc.renderer.service';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  collageLayoutState: Observable<fromCollageLayout.State>;
  singleLayoutState: Observable<fromSingleLayout.State>;

  constructor(private store: Store<fromApp.AppState>,
              private ipcRenderer: IpcRendererService,
              private router: Router) {
    this.onNewPhoto = this.onNewPhoto.bind(this);
    this.gotoPhotolist = this.gotoPhotolist.bind(this);
  }

  ngOnInit() {
    this.collageLayoutState = this.store.select('collageLayout');
    this.singleLayoutState = this.store.select('singleLayout');

    this.ipcRenderer.on(TOPICS.PHOTO, this.onNewPhoto);
    this.ipcRenderer.on(TOPICS.GOTO_PHOTOLIST, this.gotoPhotolist);
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(TOPICS.PHOTO, this.onNewPhoto);
  }

  gotoPhotolist() {
    this.router.navigate(['/photo-list']);
  }

  onNewPhoto(event, photo) {
    this.router.navigate(['/layouts/single', { photo }]);
  }
}
