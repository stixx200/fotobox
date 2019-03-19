import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Observable} from 'rxjs';
import {TOPICS} from '../../../../main/constants';
import * as collageLayoutActions from '../../layouts/collage-layout/store/collage-layout.actions';
import * as fromCollageLayout from '../../layouts/collage-layout/store/collage-layout.reducer';

import * as singleLayoutActions from '../../layouts/single-layout/store/single-layout.actions';
import * as fromSingleLayout from '../../layouts/single-layout/store/single-layout.reducer';
import {FilePickerMode, FilepickerService} from '../../providers/filepicker.service';
import {IpcRendererService} from '../../providers/ipc.renderer.service';

import * as fromApp from '../../store/app.reducer';
import * as globalActions from '../../store/global.actions';
import * as mainConfigurationActions from '../../store/mainConfiguration.actions';
import * as fromMainConfiguration from '../../store/mainConfiguration.reducers';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit, OnDestroy {
  collageLayoutState: Observable<fromCollageLayout.State>;
  singleLayoutState: Observable<fromSingleLayout.State>;
  mainConfigurationState: Observable<fromMainConfiguration.State>;

  extendedMode = false;
  statusMessage = 'PAGES.SETUP.FOTOBOX.MODAL.STATUS_INITIALIZING';

  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(private store: Store<fromApp.AppState>,
              private ipcRenderer: IpcRendererService,
              private router: Router,
              private filePickerService: FilepickerService) {
    this.onApplicationStarted = this.onApplicationStarted.bind(this);
    this.onStatusMessageReceived = this.onStatusMessageReceived.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  ngOnInit() {
    this.closeModal();

    this.collageLayoutState = this.store.select('collageLayout');
    this.singleLayoutState = this.store.select('singleLayout');
    this.mainConfigurationState = this.store.select('mainConfiguration');

    this.store.dispatch(new globalActions.SetTitle('TITLES.SETUP'));

    this.ipcRenderer.on(TOPICS.INIT_STATUSMESSAGE, this.onStatusMessageReceived);
    this.ipcRenderer.on(TOPICS.STOP_APPLICATION, this.closeModal);
  }

  ngOnDestroy() {
    this.closeModal();
    this.ipcRenderer.removeListener(TOPICS.INIT_STATUSMESSAGE, this.onStatusMessageReceived);
  }

  onModalShown(applicationSettings) {
    console.log('start application with settings: ', applicationSettings);
    this.ipcRenderer.on(TOPICS.START_APPLICATION, this.onApplicationStarted);
    this.ipcRenderer.send(TOPICS.START_APPLICATION, applicationSettings.system);
  }

  onModalHidden() {
    this.ipcRenderer.removeListener(TOPICS.START_APPLICATION, this.onApplicationStarted);
  }

  onApplicationStarted() {
    console.log('Application has started. Navigate to home.');
    this.router.navigate(['/home']).catch(console.error);
    this.closeModal();
  }

  onStatusMessageReceived(event: any, message: string) {
    this.statusMessage = message;
  }

  abortWaiting() {
    this.ipcRenderer.send(TOPICS.STOP_APPLICATION);
    this.closeModal();
  }

  closeModal() {
    this.modal.hide();
  }

  onDriverChanged(driver) {
    console.log(driver);
    this.store.dispatch(new mainConfigurationActions.SetSelectedDriver(driver));
  }

  onSingleLayoutActivatedChanged(active) {
    console.log(active);
    this.store.dispatch(new singleLayoutActions.SetActive(active));
  }

  onCollageLayoutActivatedChanged(active) {
    console.log(active);
    this.store.dispatch(new collageLayoutActions.SetActive(active));
  }

  onCollageTemplateChanged(template) {
    console.log(template);
    this.store.dispatch(new collageLayoutActions.SetTemplate(template));
  }

  onCollageTextChanged(text) {
    console.log(text);
    this.store.dispatch(new collageLayoutActions.SetText([{lines: text.split('\n')}]));
  }

  onUsePrinterChanged(usePrinter) {
    console.log(`UsePrinter changed: ${usePrinter}`);
    this.store.dispatch(new mainConfigurationActions.SetUsePrinter(usePrinter));
  }

  changeIrfanviewPath(oldPath: string) {
    const filePath = this.filePickerService.filePicker(FilePickerMode.FILE, oldPath);
    this.store.dispatch(new mainConfigurationActions.SetIrfanViewPath(filePath));
  }

  changePhotoDirPath(oldPath: string) {
    const dirPath = this.filePickerService.filePicker(FilePickerMode.DIRECTORY, oldPath);
    this.store.dispatch(new mainConfigurationActions.SetPhotoDir(dirPath));
  }
}

