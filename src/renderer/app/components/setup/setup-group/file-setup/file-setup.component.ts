import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { FilePickerMode, FilepickerService } from "../../../../providers/filepicker.service";
import { BasicSetupConfig } from "../basic-setup-config";

export interface FileSetupConfig extends BasicSetupConfig {
  type: string;
  onChanged: (path) => void;
  value: Observable<string>;
}

@Component({
  selector: "app-file-setup",
  templateUrl: "./file-setup.component.html",
  styleUrls: ["./file-setup.component.scss"],
})
export class FileSetupComponent implements OnInit {
  @Input() config: FileSetupConfig;

  constructor(private filePickerService: FilepickerService) {}

  ngOnInit() {}

  async openPicker(event: EventTarget) {
    const dirPath = await this.filePickerService.filePicker(
      FilePickerMode.FILE,
      (event as HTMLInputElement).value,
    );
    this.config.onChanged(dirPath);
  }
}
