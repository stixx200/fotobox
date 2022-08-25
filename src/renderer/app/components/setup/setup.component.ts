import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { first, map, withLatestFrom } from "rxjs/operators";
import { TOPICS } from "../../../../shared/constants";
import { ApplicationInitConfiguration } from "../../../../shared/init-configuration.interface";
import * as collageLayoutActions from "../../layouts/collage-layout/store/collage-layout.actions";
import * as fromCollageLayout from "../../layouts/collage-layout/store/collage-layout.reducer";

import * as singleLayoutActions from "../../layouts/single-layout/store/single-layout.actions";
import * as fromSingleLayout from "../../layouts/single-layout/store/single-layout.reducer";
import { IpcRendererService } from "../../providers/ipc.renderer.service";
import { getObservableValue } from "../../shared/observable.helpers";

import * as fromApp from "../../store/app.reducer";
import * as globalActions from "../../store/global.actions";
import * as mainConfigurationActions from "../../store/mainConfiguration.actions";
import * as fromMainConfiguration from "../../store/mainConfiguration.reducers";
import { SetupConfig } from "./setup-group/setup-group.component";

@Component({
  selector: "app-setup",
  templateUrl: "./setup.component.html",
  styleUrls: ["./setup.component.scss"],
})
export class SetupComponent implements OnInit, OnDestroy {
  collageLayoutState: Observable<fromCollageLayout.State>;
  singleLayoutState: Observable<fromSingleLayout.State>;
  mainConfigurationState: Observable<fromMainConfiguration.State>;

  setupConfigs: { [key: string]: SetupConfig[] } = {};

  statusMessage = "PAGES.SETUP.FOTOBOX.MODAL.STATUS_INITIALIZING";

  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(
    private store: Store<fromApp.AppState>,
    private ipcRenderer: IpcRendererService,
    private router: Router,
  ) {
    this.onApplicationStarted = this.onApplicationStarted.bind(this);
    this.onStatusMessageReceived = this.onStatusMessageReceived.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  ngOnInit() {
    this.closeModal();

    this.collageLayoutState = this.store.select("collageLayout");
    this.singleLayoutState = this.store.select("singleLayout");
    this.mainConfigurationState = this.store.select("mainConfiguration");

    this.updateTemplates();
    this.initConfigs();

    this.store.dispatch(new globalActions.SetTitle("TITLES.SETUP"));

    this.ipcRenderer.on(TOPICS.INIT_STATUSMESSAGE, this.onStatusMessageReceived);
    this.ipcRenderer.on(TOPICS.STOP_APPLICATION, this.closeModal);
  }

  ngOnDestroy() {
    this.closeModal();
    this.ipcRenderer.removeListener(TOPICS.INIT_STATUSMESSAGE, this.onStatusMessageReceived);
  }

  startApplication() {
    let applicationSettings: ApplicationInitConfiguration = null;
    this.mainConfigurationState.pipe(first()).subscribe((data) => {
      applicationSettings = {
        cameraDriver: data.selectedDriver,
        printer: data.selectedPrinter,
        photoDir: data.photoDir,
        sonyPassword: data.sonyPassword,
        wifiControl: data.wifiControl,
      };
    });
    console.log("start application with settings: ", applicationSettings);
    this.modal.show();
    this.ipcRenderer.on(TOPICS.START_APPLICATION, this.onApplicationStarted);
    this.ipcRenderer.send(TOPICS.START_APPLICATION, applicationSettings);
  }

  onModalHidden() {
    this.ipcRenderer.removeListener(TOPICS.START_APPLICATION, this.onApplicationStarted);
  }

  onApplicationStarted() {
    console.log("Application has started. Navigate to home.");
    this.router.navigate(["/home"]).catch(console.error);
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
    this.modal?.hide();
  }

  onLayoutSelectionChanged(selection: string[]) {
    const singleLayout = this.getObservableValue(this.singleLayoutState, "title");
    const collageLayout = this.getObservableValue(this.collageLayoutState, "title");
    this.store.dispatch(new singleLayoutActions.SetActive(selection.includes(singleLayout)));
    this.store.dispatch(new collageLayoutActions.SetActive(selection.includes(collageLayout)));

    this.initConfigs();
  }

  /*
   * Setup view configuration
   */

  initConfigs() {
    this.setupConfigs = {};
    this.addGeneralSetup();
    this.addCameraSetup();
  }

  private addGeneralSetup() {
    const cameraDrivers = this.ipcRenderer.sendSync(TOPICS.GET_CAMERA_DRIVERS_SYNC);
    this.store.dispatch(new mainConfigurationActions.SetCameraDrivers(cameraDrivers));
    const availablePrinters = this.ipcRenderer.sendSync(TOPICS.GET_AVAILABLE_PRINTERS_SYNC);
    this.store.dispatch(new mainConfigurationActions.SetAvailablePrinters(availablePrinters));

    this.setupConfigs.general = [
      {
        type: "directory",
        title: "PAGES.SETUP.SYSTEM.PHOTO_DIRECTORY",
        onChanged: (directory) => this.store.dispatch(new mainConfigurationActions.SetPhotoDir(directory)),
        value: this.mainConfigurationState.pipe(map((state: fromMainConfiguration.State) => state.photoDir)),
      },
      {
        type: "checkbox",
        title: "PAGES.SETUP.SYSTEM.USE_PRINTER",
        onChanged: (state) => {
          this.store.dispatch(new mainConfigurationActions.SetUsePrinter(state));
          this.initConfigs();
        },
        state: this.mainConfigurationState.pipe(map((state) => state.usePrinter)),
      },
    ];

    const usePrinter = getObservableValue(this.mainConfigurationState).usePrinter;
    if (usePrinter) {
      this.setupConfigs.general.push({
        type: "selection",
        title: "PAGES.SETUP.SYSTEM.SELECTED_PRINTER",
        selection: this.mainConfigurationState.pipe(
          map((state: fromMainConfiguration.State) => state.availablePrinters),
        ),
        selected: this.mainConfigurationState.pipe(
          map((state: fromMainConfiguration.State) => state.selectedPrinter),
        ),
        onChanged: (printer) => this.store.dispatch(new mainConfigurationActions.SetSelectedPrinter(printer)),
      });
    }
    this.setupConfigs.general.push(
      ...[
        {
          type: "number",
          title: "PAGES.SETUP.SYSTEM.SHUTTER_TIMEOUT",
          onChanged: (timeout: number) => {
            this.store.dispatch(new mainConfigurationActions.SetShutterTimeout(timeout));
          },
          value: this.mainConfigurationState.pipe(map((state) => state.shutterTimeout)),
        },
        {
          type: "multi-selection",
          title: "PAGES.SETUP.FOTOBOX.LAYOUTS.TITLE",
          selection: this.singleLayoutState.pipe(
            withLatestFrom(this.collageLayoutState),
            map(([single, collage]) => [single.title, collage.title]),
          ),
          selected: this.singleLayoutState.pipe(
            withLatestFrom(this.collageLayoutState),
            map(([single, collage]) => {
              const selected = [];
              if (single.active) {
                selected.push(single.title);
              }
              if (collage.active) {
                selected.push(collage.title);
              }
              return selected;
            }),
          ),
          onChanged: (selection) => this.onLayoutSelectionChanged(selection),
        },
      ],
    );

    this.addCollageSetup();
  }

  private addCollageSetup() {
    const collageLayoutActive = this.getObservableValue(this.collageLayoutState, "active");
    if (collageLayoutActive) {
      this.setupConfigs.collage = [
        {
          type: "directory",
          title: "PAGES.SETUP.SYSTEM.TEMPLATES_DIRECTORY",
          onChanged: (directory) => {
            this.store.dispatch(new collageLayoutActions.SetTemplatesDir(directory));
            // get all templates from the new directory and update available templates
            this.updateTemplates(directory);
          },
          value: this.collageLayoutState.pipe(
            map((state: fromCollageLayout.State) => state.templatesDirectory),
          ),
        },
        {
          type: "button",
          title: "PAGES.SETUP.SYSTEM.UPDATE_TEMPLATES",
          onClick: () => this.updateTemplates(),
        },
        {
          title: "PAGES.SETUP.FOTOBOX.LAYOUTS.COLLAGE-TEMPLATES",
          type: "multi-selection",
          selection: this.collageLayoutState.pipe(map((state: fromCollageLayout.State) => state.templates)),
          selected: this.collageLayoutState.pipe(
            map((state: fromCollageLayout.State) => state.selectedTemplates),
          ),
          onChanged: (selection) => {
            this.store.dispatch(new collageLayoutActions.SetSelectedTemplates(selection));
          },
        },
      ];
    }
  }

  private addCameraSetup() {
    this.setupConfigs.camera = [
      {
        type: "selection",
        title: "PAGES.SETUP.SYSTEM.CAMERA_DRIVERS.TITLE",
        selection: this.mainConfigurationState.pipe(
          map((state: fromMainConfiguration.State) => state.cameraDrivers),
        ),
        selected: this.mainConfigurationState.pipe(
          map((state: fromMainConfiguration.State) => state.selectedDriver),
        ),
        onChanged: (driver) => {
          this.store.dispatch(new mainConfigurationActions.SetSelectedDriver(driver));
          this.initConfigs();
        },
        translationBase: "PAGES.SETUP.SYSTEM.CAMERA_DRIVERS.",
      },
    ];

    const selectedDriver = this.getObservableValue(this.mainConfigurationState, "selectedDriver");
    if (selectedDriver === "sony") {
      this.setupConfigs.camera.push({
        type: "checkbox",
        title: "PAGES.SETUP.SYSTEM.SONY.AUTOCONNECT",
        state: this.mainConfigurationState.pipe(
          map((state: fromMainConfiguration.State) => state.wifiControl),
        ),
        onChanged: (state) => {
          this.store.dispatch(new mainConfigurationActions.SetWifiControl(state));
          this.initConfigs();
        },
      });

      const wifiControl = this.getObservableValue(this.mainConfigurationState, "wifiControl");
      if (wifiControl) {
        this.setupConfigs.camera.push({
          type: "text",
          title: "PAGES.SETUP.SYSTEM.SONY.PASSWORD",
          value: this.mainConfigurationState.pipe(
            map((state: fromMainConfiguration.State) => state.sonyPassword),
          ),
          onChanged: (password) => {
            this.store.dispatch(new mainConfigurationActions.SetSonyPassword(password));
          },
        });
      }
    }
  }

  private getObservableValue(observable: Observable<any>, key: string): any {
    let value = null;
    const subscription = observable.pipe(first()).subscribe((data) => {
      value = data[key];
    });
    subscription.unsubscribe();
    return value;
  }

  // todo: move updateTemplates to collage-layout
  private updateTemplates(templatesDir?: string) {
    let dir = templatesDir;
    if (!dir) {
      dir = this.getObservableValue(this.collageLayoutState, "templatesDirectory");
    }
    const templates = this.ipcRenderer.sendSync(TOPICS.GET_TEMPLATES_SYNC, dir);
    this.store.dispatch(new collageLayoutActions.SetTemplates(templates));
  }
}
