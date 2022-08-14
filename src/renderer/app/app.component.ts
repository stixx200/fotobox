import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from "@angular/material/snack-bar";
import { SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import {Subscription}'rxjs'"rxjs";
import {TOPICS}'../../shared/constants'tants";

import {APP_CONFIG} from '../environments/environment';
import {ElectronService} from './providers/electron.service';
import { IpcRendererService } from "./providers/ipc.renderer.service";
import { LiveViewService } from "./providers/live-view.service";
import * as fromApp from "./store/app.reducer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  liveViewSubscription: Subscription;
  snackBarRef: MatSnackBarRef<SimpleSnackBar>;

  @ViewChild("page")
  page: ElementRef;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private ipcRenderer: IpcRendererService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private liveViewService: LiveViewService,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
  ) {
    this.onErroMessage = this.onErroMessage.bind(this);
    this.onApplicationStopped = this.onApplicationStopped.bind(this);

    translate.setDefaultLang('de');
    console.log('APP_CONFIG', APP_CONFIG);

    console.log('Electron ipcRenderer', electronService.ipcRenderer);
  }

  ngOnInit() {
    this.ipcRenderer.on(TOPICS.ERROR_MESSAGE, this.onErroMessage);
    this.ipcRenderer.on(TOPICS.STOP_APPLICATION, this.onApplicationStopped);
    this.liveViewSubscription = this.liveViewService
      .getLiveView()
      .subscribe((data: SafeResourceUrl) => this.onLiveViewData(data));
  }

  ngOnDestroy() {
    this.dismissSnackbar();
    if (this.liveViewSubscription) {
      this.liveViewSubscription.unsubscribe();
    }
    this.removeBackground();
    this.ipcRenderer.removeListener(TOPICS.STOP_APPLICATION, this.onApplicationStopped);
    this.ipcRenderer.removeListener(TOPICS.ERROR_MESSAGE, this.onErroMessage);
  }

  onApplicationStopped(event, errorCode?: string) {
    console.warn("Application has stopped. Goto settings. Error was: " + JSON.stringify(errorCode));
    this.removeBackground();
    this.router.navigate(["/"]).catch(console.error);
    if (errorCode) {
      this.showSnackbar(errorCode);
    }
  }

  private onLiveViewData(data: SafeResourceUrl) {
    this.renderer.setStyle(this.page.nativeElement, "background-size", `cover`);
    this.renderer.setStyle(this.page.nativeElement, "background-image", `url(${data})`);
  }

  private removeBackground() {
    this.renderer.removeStyle(this.page.nativeElement, "background-size");
    this.renderer.removeStyle(this.page.nativeElement, "background-image");
  }

  private showSnackbar(message) {
    this.dismissSnackbar();
    this.snackBarRef = this.snackBar.open(message, "ok");
  }

  private dismissSnackbar() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  private onErroMessage(event, message) {
    console.error(message);
    this.showSnackbar(message);
  }
}
