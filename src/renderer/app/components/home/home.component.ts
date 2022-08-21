import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { first, take } from "rxjs/operators";
import { TOPICS } from "../../../../shared/constants";
import * as fromCollageLayout from "../../layouts/collage-layout/store/collage-layout.reducer";
import * as fromSingleLayout from "../../layouts/single-layout/store/single-layout.reducer";
import { IpcRendererService } from "../../providers/ipc.renderer.service";
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  collageLayoutState: Observable<fromCollageLayout.State>;
  singleLayoutState: Observable<fromSingleLayout.State>;

  constructor(
    private store: Store<fromApp.AppState>,
    private ipcRenderer: IpcRendererService,
    private router: Router,
  ) {
    this.onNewPhoto = this.onNewPhoto.bind(this);
    this.gotoPhotolist = this.gotoPhotolist.bind(this);
  }

  ngOnInit() {
    this.collageLayoutState = this.store.select("collageLayout");
    this.singleLayoutState = this.store.select("singleLayout");

    this.ipcRenderer.on(TOPICS.PHOTO, this.onNewPhoto);
    this.ipcRenderer.on(TOPICS.GOTO_PHOTOLIST, this.gotoPhotolist);

    if (!this.isLayoutActive(this.collageLayoutState)) {
      this.router.navigate(["/layouts/single"]);
    } else if (!this.isLayoutActive(this.singleLayoutState)) {
      const selectedTemplates = this.getObservableValue(this.collageLayoutState, "selectedTemplates");
      if (selectedTemplates.length === 1) {
        this.router.navigate(["/layouts/collage", selectedTemplates[0]]);
      }
    }
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(TOPICS.GOTO_PHOTOLIST, this.gotoPhotolist);
    this.ipcRenderer.removeListener(TOPICS.PHOTO, this.onNewPhoto);
  }

  gotoPhotolist() {
    this.router.navigate(["/photo-list"]);
  }

  onNewPhoto(event, photo) {
    this.router.navigate(["/layouts/single", { photo }]);
  }

  isLayoutActive(state: Observable<fromCollageLayout.State | fromSingleLayout.State>) {
    let isActive = true;
    state.pipe(take(1)).subscribe(({ active }) => {
      isActive = active;
    });
    return isActive;
  }

  private getObservableValue(observable: Observable<any>, key: string): any {
    let value = null;
    const subscription = observable.pipe(first()).subscribe((data) => {
      value = data[key];
    });
    subscription.unsubscribe();
    return value;
  }
}
