import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FilePickerMode, FilepickerService} from '../../../../providers/filepicker.service';
import {BasicSetupConfig} from '../basic-setup-config';

export interface DirectorySetupConfig extends BasicSetupConfig {
  type: string;
  onChanged: (path) => void;
  value: Observable<string>;
}

@Component({
  selector: 'app-directory-setup',
  templateUrl: './directory-setup.component.html',
  styleUrls: ['./directory-setup.component.scss'],
})
export class DirectorySetupComponent implements OnInit {
  @Input() config: DirectorySetupConfig;

  constructor(private filePickerService: FilepickerService) {
  }

  ngOnInit() {
  }

  openPicker(oldPath) {
    const dirPath = this.filePickerService.filePicker(FilePickerMode.DIRECTORY, oldPath);
    this.config.onChanged(dirPath);
  }
}
