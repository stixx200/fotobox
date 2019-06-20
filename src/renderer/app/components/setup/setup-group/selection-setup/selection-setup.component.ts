import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BasicSetupConfig} from '../basic-setup-config';

export interface SelectionSetupConfig extends BasicSetupConfig {
  type: string;
  translationBase?: string;
  selection: Observable<string[]>;
  selected: Observable<string>;
  onChanged: (event) => void;
}

@Component({
  selector: 'app-selection-setup',
  templateUrl: './selection-setup.component.html',
  styleUrls: ['./selection-setup.component.scss'],
})
export class SelectionSetupComponent implements OnInit {
  @Input() config: SelectionSetupConfig;

  constructor() {
  }

  ngOnInit() {
  }
}
