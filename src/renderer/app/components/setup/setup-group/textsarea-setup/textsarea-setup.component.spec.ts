import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextsareaSetupComponent} from './textsarea-setup.component';

describe('SelectionSetupComponent', () => {
  let component: TextsareaSetupComponent;
  let fixture: ComponentFixture<TextsareaSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TextsareaSetupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextsareaSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
