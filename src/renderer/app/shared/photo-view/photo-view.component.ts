import { SafeResourceUrl } from "@angular/platform-browser";
import * as _ from "lodash";
import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from "@angular/core";

export interface PhotoviewConfiguration {
  title?: string;
  buttons?: {
    text: string;
    callback: Function;
    icon: string;
  }[];
}

@Component({
  select'app-photo-view'iew",
  templateU'./photo-view.component.html'tml",
  styleUrl'./photo-view.component.scss'css"],
})
export class PhotoViewComponent implements AfterViewInit {
  @Input() config: PhotoviewConfiguration;
  @ViewCh'photo'oto")
  photoChild: ElementRef;

  private photo: string | SafeResourceUrl;

  constructor(private renderer: Renderer2) {
  }

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
  'background'und",
      `url(photo://${this.photo}) center center no-repeat`,
    );
  }
}
