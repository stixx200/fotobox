import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BasicSetupConfig} from '../basic-setup-config';

export interface MultiSelectionSetupConfig extends BasicSetupConfig {
  type: string;
  translationBase?: string;
  selection: Observable<string[]>;
  selected: Observable<string[]>;
  onChanged: (selected: string[]) => void;
}

@Component({
  selector: 'app-multi-selection-setup',
  templateUrl: './multi-selection-setup.component.html',
  styleUrls: ['./multi-selection-setup.component.scss'],
})
export class MultiSelectionSetupComponent implements OnInit {
  @Input() config: MultiSelectionSetupConfig;

  constructor() {
  }

  ngOnInit() {
  }

  isSelected(value) {
    const selected = this.getSelected();
    return selected.includes(value);
  }

  selectionChanged(value: string, isSelected: boolean) {
    const selected = this.getSelected();
    if (isSelected && !selected.includes(value)) {
      selected.push(value);
    } else if (!isSelected && selected.includes(value)) {
      const idx = selected.findIndex(val => (val === value));
      selected.splice(idx, 1);
    }
    this.config.onChanged(selected);
  }

  private getSelected(): string[] {
    let selected = [];
    const subscription = this.config.selected.subscribe(sel => {
      selected = sel;
    });
    subscription.unsubscribe();
    return selected;
  }
}
