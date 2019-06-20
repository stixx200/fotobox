import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BasicSetupConfig} from '../basic-setup-config';

export interface TextSetupConfig extends BasicSetupConfig {
  type: string;
  onChanged: (text) => void;
  value: Observable<string>;
}

@Component({
  selector: 'app-text-setup',
  templateUrl: './text-setup.component.html',
  styleUrls: ['./text-setup.component.scss'],
})
export class TextSetupComponent implements OnInit {
  @Input() config: TextSetupConfig;

  constructor() {
  }

  ngOnInit() {
  }
}
