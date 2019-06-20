import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FilePickerMode, FilepickerService} from '../../../../providers/filepicker.service';
import {BasicSetupConfig} from '../basic-setup-config';

export interface FileSetupConfig extends BasicSetupConfig {
  type: string;
  onChanged: (path) => void;
  value: Observable<string>;
}

@Component({
  selector: 'app-file-setup',
  templateUrl: './file-setup.component.html',
  styleUrls: ['./file-setup.component.scss'],
})
export class FileSetupComponent implements OnInit {
  @Input() config: FileSetupConfig;

  constructor(private filePickerService: FilepickerService) {
  }

  ngOnInit() {
  }

  openPicker(oldPath) {
    const dirPath = this.filePickerService.filePicker(FilePickerMode.FILE, oldPath);
    this.config.onChanged(dirPath);
  }
}
