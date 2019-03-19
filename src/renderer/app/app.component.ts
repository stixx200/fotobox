import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {TOPICS} from '../../main/constants';

import {AppConfig} from '../environments/environment';
import * as collageLayoutActions from './layouts/collage-layout/store/collage-layout.actions';
import {ElectronService} from './providers/electron.service';
import {IpcRendererService} from './providers/ipc.renderer.service';
import {LiveViewService} from './providers/live-view.service';
import * as fromApp from './store/app.reducer';
import {SetCameraDrivers} from './store/mainConfiguration.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  liveViewSubscription: Subscription;

  @ViewChild('page')
  page: ElementRef;

  constructor(public electronService: ElectronService,
              private translate: TranslateService,
              private ipcRenderer: IpcRendererService,
              private store: Store<fromApp.AppState>,
              private router: Router,
              private liveViewService: LiveViewService,
              private renderer: Renderer2) {
    this.onApplicationStopped = this.onApplicationStopped.bind(this);

    translate.setDefaultLang('de');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    // get camera drivers from main process
    const mainConfiguration = this.ipcRenderer.sendSync(TOPICS.GET_APP_CONFIG_SYNC);
    this.store.dispatch(new SetCameraDrivers(mainConfiguration.cameraDrivers));
    this.store.dispatch(new collageLayoutActions.SetTemplates(mainConfiguration.templates));
  }

  ngOnInit() {
    this.ipcRenderer.on(TOPICS.STOP_APPLICATION, this.onApplicationStopped);

    this.liveViewSubscription = this.liveViewService.getLiveView().subscribe((data: SafeResourceUrl) => {
      this.renderer.setStyle(this.page.nativeElement, 'background-size', `cover`);
      this.renderer.setStyle(this.page.nativeElement, 'background-image', `url(${data})`);
    });
  }

  ngOnDestroy() {
    this.liveViewService.stopLiveView();
    this.ipcRenderer.removeListener(TOPICS.STOP_APPLICATION, this.onApplicationStopped);
  }

  onApplicationStopped() {
    console.warn('Application has stopped. Goto settings.');
    this.router.navigate(['/']).catch(console.error);
  }
}
