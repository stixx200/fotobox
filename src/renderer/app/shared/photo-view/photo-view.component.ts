import * as _ from 'lodash';
import {Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {SafeResourceUrl} from '@angular/platform-browser/src/security/dom_sanitization_service';

export interface PhotoviewConfiguration {
  title?: string;
  buttons?: {
    text: string;
    callback: Function;
    icon: string;
  }[];
}

@Component({
  selector: 'app-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss'],
})
export class PhotoViewComponent {
  @Input() config: PhotoviewConfiguration;
  @ViewChild('photo') photoChild: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  @Input()
  set photoUrl(photo: string) {
    if (_.isString(photo)) {
      this.showPhoto(`photo://${photo}`);
    }
  }

  showPhoto(url: string | SafeResourceUrl) {
    if (url) {
      this.renderer.setStyle(this.photoChild.nativeElement, 'background', `url(${url}) center center no-repeat`);
    }
  }
}
