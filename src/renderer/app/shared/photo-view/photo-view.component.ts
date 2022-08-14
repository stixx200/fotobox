import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import * as _ from "lodash";

export interface PhotoviewConfiguration {
  title?: string;
  buttons?: {
    text: string;
    callback: Function;
    icon: string;
  }[];
}

@Component({
  selector: "app-photo-view",
  templateUrl: "./photo-view.component.html",
  styleUrls: ["./photo-view.component.scss"],
})
export class PhotoViewComponent implements AfterViewInit {
  @Input() config: PhotoviewConfiguration;
  @ViewChild("photo")
  photoChild: ElementRef;

  private photo: string | SafeResourceUrl;

  constructor(private renderer: Renderer2) {}

  @Input()
  set photoUrl(photo: string | SafeResourceUrl) {
    this.photo = photo;
    this.showPhoto();
  }

  ngAfterViewInit() {
    this.showPhoto();
  }

  private showPhoto() {
    if (!_.isString(this.photo) || !this.photoChild) {
      return;
    }
    this.renderer.setStyle(
      this.photoChild.nativeElement,
      "background",
      `url(photo://${this.photo}) center center no-repeat`,
    );
  }
}
