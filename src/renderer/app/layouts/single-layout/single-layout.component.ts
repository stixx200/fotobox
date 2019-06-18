import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {TOPICS} from '../../../../main/constants';
import {IpcRendererService} from '../../providers/ipc.renderer.service';
import {CountdownComponent} from '../../shared/countdown/countdown.component';
import {PhotoviewConfiguration} from '../../shared/photo-view/photo-view.component';
import * as fromApp from '../../store/app.reducer';
import * as fromMainConfiguration from '../../store/mainConfiguration.reducers';
import * as fromCollageLayout from '../collage-layout/store/collage-layout.reducer';

@Component({
  selector: 'app-single-layout',
  templateUrl: './single-layout.component.html',
  styleUrls: ['./single-layout.component.scss'],
})
export class SingleLayoutComponent implements OnInit, OnDestroy {
  photoviewConfiguration: PhotoviewConfiguration;
  nextDialog: PhotoviewConfiguration = {
    title: '',
    buttons: [{
      text: 'NEXT',
      icon: '',
      callback: () => this.exit(),
    }],
  };
  printDialog: PhotoviewConfiguration = {
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

  photo: string;
  mainConfigurationState: Observable<fromMainConfiguration.State> = this.store.select('mainConfiguration');
  collageLayoutState: Observable<fromCollageLayout.State> = this.store.select('collageLayout');

  @ViewChild('countdown') countdown: CountdownComponent;

  constructor(private router: Router,
              private ipcRenderer: IpcRendererService,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
    this.exit = this.exit.bind(this);
    this.print = this.print.bind(this);
    this.onNewPhoto = this.onNewPhoto.bind(this);
  }

  ngOnInit() {
    this.ipcRenderer.on(TOPICS.PHOTO, this.onNewPhoto);
    const photo = this.route.snapshot.paramMap.get('photo');
    console.log(photo);
    if (photo) {
      this.onNewPhoto(null, photo);
    }
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(TOPICS.PHOTO, this.onNewPhoto);
  }

  onNewPhoto(event, photo) {
    this.mainConfigurationState.pipe(take(1)).subscribe(({usePrinter}) => {
      console.log('showing new photo');
      if (usePrinter) {
        this.photoviewConfiguration = this.printDialog;
      } else {
        this.photoviewConfiguration = this.nextDialog;
      }
      this.photo = photo;
    });
  }

  takePicture() {
    if (this.photo) {
      // ignore taking pictures when one is available
      return;
    }

    console.log('Trigger picture creation');
    this.countdown.start();
  }

  exit() {
    this.abortCountdown();
    this.router.navigate(['/home']);
  }

  print() {
    this.abortCountdown();
    this.ipcRenderer.sendSync(TOPICS.PRINT_SYNC, this.photo);
    this.router.navigate(['/home']);
  }

  abortCountdown() {
    if (this.countdown) {
      this.countdown.abort();
    }
  }
}
