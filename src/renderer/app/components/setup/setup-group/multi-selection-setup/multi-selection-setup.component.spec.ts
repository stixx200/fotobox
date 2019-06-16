import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiSelectionSetupComponent} from './multi-selection-setup.component';

describe('SelectionSetupComponent', () => {
  let component: MultiSelectionSetupComponent;
  let fixture: ComponentFixture<MultiSelectionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [MultiSelectionSetupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
