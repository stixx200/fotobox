import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TOPICS} from '../../../../main/constants';
import {IpcRendererService} from '../../providers/ipc.renderer.service';
import {PhotoviewConfiguration} from '../../shared/photo-view/photo-view.component';

@Component({
  selector: 'app-single-layout',
  templateUrl: './single-layout.component.html',
  styleUrls: ['./single-layout.component.scss'],
})
export class SingleLayoutComponent implements OnInit, OnDestroy {
  photoviewConfiguration: PhotoviewConfiguration = {
    title: 'PRINT_QUESTION',
    buttons: [{
      text: 'YES',
      icon: '',
      callback: () => this.print(),
    }, {
      text: 'NO',
      icon: '',
      callback: () => this.exit(),
    }],
  };

  photo: string;
  @ViewChild('background') background: ElementRef;

  constructor(private router: Router,
              private ipcRenderer: IpcRendererService,
              private route: ActivatedRoute) {
    this.exit = this.exit.bind(this);
    this.print = this.print.bind(this);
    this.onNewPhoto = this.onNewPhoto.bind(this);
  }

  ngOnInit() {
    this.ipcRenderer.on(TOPICS.PHOTO, this.onNewPhoto);
    const photo = this.route.snapshot.paramMap.get('photo');
    console.log(photo);
    if (photo) {
      this.onNewPhoto(null, photo);
    }
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(TOPICS.PHOTO, this.onNewPhoto);
  }

  onNewPhoto(event, photo) {
    this.photo = photo;
  }

  exit() {
    this.router.navigate(['/home']);
  }

  print() {
    this.ipcRenderer.sendSync(TOPICS.PRINT_SYNC, this.photo);
    this.router.navigate(['/home']);
  }
}
