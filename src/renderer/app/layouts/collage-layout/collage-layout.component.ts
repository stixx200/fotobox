import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { TOPICS } from "../../../../shared/constants";
import { IpcRendererService } from "../../providers/ipc.renderer.service";
import { CountdownComponent } from "../../shared/countdown/countdown.component";
import { PhotoviewConfiguration } from "../../shared/photo-view/photo-view.component";

import * as fromApp from "../../store/app.reducer";
import * as fromMainConfiguration from "../../store/mainConfiguration.reducers";
import * as fromSingleLayout from "../single-layout/store/single-layout.reducer";
import { CollageImageComponent } from "./collage-image/collage-image.component";
import * as fromCollage from "./store/collage-layout.reducer";

@Component({
  selector: "app-collage-layout",
  templateUrl: "./collage-layout.component.html",
  styleUrls: ["./collage-layout.component.scss"],
})
export class CollageLayoutComponent implements OnInit, OnDestroy {
  photoviewConfiguration: PhotoviewConfiguration;
  nextDialog: PhotoviewConfiguration = {
    title: "",
    buttons: [
      {
        text: "NEXT",
        icon: "",
        callback: () => this.exit(),
      },
    ],
  };
  printDialog: PhotoviewConfiguration = {
    title: "PRINT_QUESTION",
    buttons: [
      {
        text: "YES",
        icon: "",
        callback: () => this.print(),
      },
      {
        text: "NO",
        icon: "",
        callback: () => this.exit(),
      },
    ],
  };
  @ViewChild("imageComponent") collageComponent: CollageImageComponent;
  @ViewChild("countdown") countdown: CountdownComponent;
  mainConfigurationState: Observable<fromMainConfiguration.State>;
  collageState: Observable<fromCollage.State>;
  singleLayoutState: Observable<fromSingleLayout.State>;
  photos: string[];
  currentPhoto: string;
  usePhotoDialog: PhotoviewConfiguration = {
    title: "USE_QUESTION",
    buttons: [
      {
        text: "YES",
        icon: "",
        callback: () => this.useCurrentPhoto(),
      },
      {
        text: "NO",
        icon: "",
        callback: () => (this.currentPhoto = null),
      },
    ],
  };
  topMessage = "LAYOUTS.READY_TAKE_PICTURE";
  bottomMessage = "LAYOUTS.ABORT";

  private snackBarRef: MatSnackBarRef<SimpleSnackBar>;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private ipcRenderer: IpcRendererService,
    private snackBar: MatSnackBar,
  ) {
    this.onNewPhoto = this.onNewPhoto.bind(this);
  }

  ngOnInit() {
    this.reset();
    this.collageState = this.store.select("collageLayout");
    this.singleLayoutState = this.store.select("singleLayout");
    this.mainConfigurationState = this.store.select("mainConfiguration");
    this.ipcRenderer.on(TOPICS.PHOTO, this.onNewPhoto);
  }

  ngOnDestroy() {
    this.collageComponent.reset();
    this.ipcRenderer.removeListener(TOPICS.PHOTO, this.onNewPhoto);
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
    this.router.navigate(["/home"]);
  }

  takePicture() {
    if (!this.currentPhoto) {
      console.log("Trigger picture creation");
      this.countdown.start();
    }
  }

  print() {
    const errorMessage = this.ipcRenderer.sendSync(TOPICS.PRINT_SYNC, this.currentPhoto);
    if (errorMessage) {
      this.snackBarRef = this.snackBar.open(errorMessage, "ok");
    }
    // exit collage view after printing
    this.exit();
  }

  onCollageDone(collage: string) {
    this.mainConfigurationState.pipe(take(1)).subscribe(({ usePrinter }) => {
      if (usePrinter) {
        this.photoviewConfiguration = this.printDialog;
      } else {
        this.photoviewConfiguration = this.nextDialog;
      }
      this.currentPhoto = collage;
    });
  }

  private onNewPhoto(event: Event, photoUrl: string) {
    this.currentPhoto = photoUrl;
    if (this.collageComponent.previewAvailable) {
      this.photoviewConfiguration = this.usePhotoDialog;
    } else {
      this.useCurrentPhoto();
    }
  }

  private useCurrentPhoto() {
    this.collageComponent.addPhoto(this.currentPhoto);
    this.currentPhoto = null;
  }
}
