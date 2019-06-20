import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberSetupComponent} from './number-setup.component';

describe('SelectionSetupComponent', () => {
  let component: NumberSetupComponent;
  let fixture: ComponentFixture<NumberSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [NumberSetupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
