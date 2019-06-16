import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SetupGroupComponent} from './setup-group.component';

describe('SetupGroupComponent', () => {
  let component: SetupGroupComponent;
  let fixture: ComponentFixture<SetupGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [SetupGroupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
