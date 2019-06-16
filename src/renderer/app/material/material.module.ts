import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTabsModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const usedModules = [
  MatButtonModule,
  MatCheckboxModule,
  BrowserAnimationsModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatDividerModule,
  FormsModule,
  MatCardModule,
  MatGridListModule,
  MatTabsModule,
];

@NgModule({
  imports: usedModules,
  exports: usedModules,
  declarations: [],
})
export class MaterialModule { }
