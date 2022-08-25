import { Component, OnDestroy, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { TOPICS } from "../../../../shared/constants";
import { IpcRendererService } from "../../providers/ipc.renderer.service";
import { PhotoviewConfiguration } from "../../shared/photo-view/photo-view.component";
import * as fromApp from "../../store/app.reducer";
import * as fromMainConfiguration from "../../store/mainConfiguration.reducers";

@Component({
  templateUrl: "./photo-list.component.html",
  styleUrls: ["./photo-list.component.css"],
})
export class PhotoListComponent implements OnInit, OnDestroy {
  photos: string[] = [];

  selectedPhoto: string;
  photoviewConfiguration: PhotoviewConfiguration = {
    buttons: [],
    title: "",
  };
  mainConfigurationState: Observable<fromMainConfiguration.State>;

  constructor(
    private store: Store<fromApp.AppState>,
    private ipcRenderer: IpcRendererService,
    public sanitizer: DomSanitizer,
    private router: Router,
  ) {
    this.receivePhotos = this.receivePhotos.bind(this);
    this.gotoHome = this.gotoHome.bind(this);
  }

  ngOnInit() {
    this.mainConfigurationState = this.store.select("mainConfiguration");

    this.ipcRenderer.on(TOPICS.ALL_PHOTOS, this.receivePhotos);
    this.ipcRenderer.on(TOPICS.GOTO_PHOTOLIST, this.gotoHome);

    this.mainConfigurationState.pipe(take(1)).subscribe((state: fromMainConfiguration.State) => {
      this.ipcRenderer.send(TOPICS.ALL_PHOTOS, state.photoDir);
    });
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(TOPICS.GOTO_PHOTOLIST, this.gotoHome);
    this.ipcRenderer.removeListener(TOPICS.ALL_PHOTOS, this.receivePhotos);
  }

  setSelectedPhoto(photo: string) {
    this.selectedPhoto = photo;

    // configure buttons
    this.photoviewConfiguration.buttons = [
      { icon: "fa-arrow-left", text: "zurück", callback: this.last.bind(this) },
      { icon: "fa-print", text: "ausdrucken", callback: this.print.bind(this) },
      { icon: "", text: "Übersicht", callback: this.unsetSelectedPhoto.bind(this) },
      { icon: "fa-arrow-right", text: "nächstes", callback: this.next.bind(this) },
    ];

    const index = _.indexOf(this.photos, this.selectedPhoto);
    console.log("show photo at index " + index);
    if (index === 0) {
      this.photoviewConfiguration.buttons.shift();
      this.photoviewConfiguration.buttons.unshift({ icon: "fa-minus", text: "", callback: () => {} });
    } else if (index === this.photos.length - 1) {
      this.photoviewConfiguration.buttons.pop();
      this.photoviewConfiguration.buttons.push({ icon: "fa-minus", text: "", callback: () => {} });
    }
  }

  private gotoHome() {
    this.router.navigate(["/home"]);
  }

  private receivePhotos(event: any, photos: string[]) {
    this.photos = photos;
  }

  private last() {
    const index = _.indexOf(this.photos, this.selectedPhoto) - 1;
    if (this.photos[index]) {
      this.setSelectedPhoto(this.photos[index]);
    }
  }

  private next() {
    const index = _.indexOf(this.photos, this.selectedPhoto) + 1;
    if (this.photos[index]) {
      this.setSelectedPhoto(this.photos[index]);
    }
  }

  private unsetSelectedPhoto() {
    this.selectedPhoto = null;
  }

  private print() {
    this.ipcRenderer.send(TOPICS.PRINT, this.selectedPhoto);
    this.unsetSelectedPhoto();
  }
}
