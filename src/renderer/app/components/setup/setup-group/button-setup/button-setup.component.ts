import {Component, Input, OnInit} from '@angular/core';
import {BasicSetupConfig} from '../basic-setup-config';

export interface ButtonSetupConfig extends BasicSetupConfig {
  type: string;
  onClick: () => void;
}

@Component({
  selector: 'app-button-setup',
  templateUrl: './button-setup.component.html',
  styleUrls: ['./button-setup.component.scss'],
})
export class ButtonSetupComponent implements OnInit {
  @Input() config: ButtonSetupConfig;

  constructor() {
  }

  ngOnInit() {
  }
}
