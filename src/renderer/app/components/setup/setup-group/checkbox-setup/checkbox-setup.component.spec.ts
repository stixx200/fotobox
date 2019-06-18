import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckboxSetupComponent} from './checkbox-setup.component';

describe('SelectionSetupComponent', () => {
  let component: CheckboxSetupComponent;
  let fixture: ComponentFixture<CheckboxSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [CheckboxSetupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
