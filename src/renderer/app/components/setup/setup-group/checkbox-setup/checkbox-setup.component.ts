import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BasicSetupConfig} from '../basic-setup-config';

export interface CheckboxSetupConfig extends BasicSetupConfig {
  type: string;
  onChanged: (state) => void;
  state: Observable<boolean>;
}

@Component({
  selector: 'app-checkbox-setup',
  templateUrl: './checkbox-setup.component.html',
  styleUrls: ['./checkbox-setup.component.scss'],
})
export class CheckboxSetupComponent implements OnInit {
  @Input() config: CheckboxSetupConfig;

  constructor() {
  }

  ngOnInit() {
  }
}
