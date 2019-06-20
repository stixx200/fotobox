import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonSetupComponent} from './button-setup.component';

describe('SelectionSetupComponent', () => {
  let component: ButtonSetupComponent;
  let fixture: ComponentFixture<ButtonSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ButtonSetupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
