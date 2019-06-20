import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BasicSetupConfig} from '../basic-setup-config';

export interface NumberSetupConfig extends BasicSetupConfig {
  type: string;
  onChanged: (number: number) => void;
  value: Observable<number>;
}

@Component({
  selector: 'app-number-setup',
  templateUrl: './number-setup.component.html',
  styleUrls: ['./number-setup.component.scss'],
})
export class NumberSetupComponent implements OnInit {
  @Input() config: NumberSetupConfig;

  constructor() {
  }

  ngOnInit() {
  }
}
