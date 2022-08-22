import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { TOPICS } from "../../../../shared/constants";
import * as fromCollageLayout from "../../layouts/collage-layout/store/collage-layout.reducer";
import { IpcRendererService } from "../../providers/ipc.renderer.service";
import { getObservableValue } from "../../shared/observable.helpers";
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: "layout-preview",
  templateUrl: "./layout.preview.component.html",
  styleUrls: ["./layout.preview.component.scss"],
})
export class LayoutPreviewComponent implements AfterViewInit {
  private static previewCache = new Map<string, Uint8Array>();

  @ViewChild("previewElement")
  previewElement: ElementRef;

  @Input("templateId")
  templateId: string;

  collageLayoutState: Observable<fromCollageLayout.State> = this.store.select("collageLayout");

  constructor(
    private renderer: Renderer2,
    private ipcRenderer: IpcRendererService,
    private store: Store<fromApp.AppState>,
  ) {}

  async ngAfterViewInit() {
    if (!this.templateId) {
      this.renderer.addClass(this.previewElement.nativeElement, "singlelayout");
    } else {
      if (!LayoutPreviewComponent.previewCache.has(this.templateId)) {
        LayoutPreviewComponent.previewCache.set(
          this.templateId,
          this.ipcRenderer.sendSync(
            TOPICS.CREATE_COLLAGE_PREVIEW_SYNC,
            this.templateId,
            getObservableValue(this.collageLayoutState).templatesDirectory,
          ),
        );
      }

      this.showImg(LayoutPreviewComponent.previewCache.get(this.templateId));
    }
  }

  private showImg(data: Uint8Array) {
    this.renderer.setStyle(
      this.previewElement.nativeElement,
      "background",
      `url(data:image/jpg;base64,${Buffer.from(data).toString("base64")}) center center no-repeat`,
    );
  }
}
