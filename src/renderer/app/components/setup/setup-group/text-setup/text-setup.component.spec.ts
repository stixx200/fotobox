import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextSetupComponent} from './text-setup.component';

describe('SelectionSetupComponent', () => {
  let component: TextSetupComponent;
  let fixture: ComponentFixture<TextSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TextSetupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
