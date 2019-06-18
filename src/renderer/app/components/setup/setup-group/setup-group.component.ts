import {Component, Input} from '@angular/core';
import {CheckboxSetupConfig} from './checkbox-setup/checkbox-setup.component';
import {DirectorySetupConfig} from './directory-setup/directory-setup.component';
import {FileSetupConfig} from './file-setup/file-setup.component';
import {MultiSelectionSetupConfig} from './multi-selection-setup/multi-selection-setup.component';
import {SelectionSetupConfig} from './selection-setup/selection-setup.component';
import {TextsareaSetupConfig} from './textsarea-setup/textsarea-setup.component';

export type SetupConfig =
  SelectionSetupConfig
  | DirectorySetupConfig
  | FileSetupConfig
  | CheckboxSetupConfig
  | MultiSelectionSetupConfig
  | TextsareaSetupConfig;

@Component({
  selector: 'app-setup-group',
  templateUrl: './setup-group.component.html',
  styleUrls: ['./setup-group.component.scss'],
})
export class SetupGroupComponent {
  @Input() config: SetupConfig[];
}
