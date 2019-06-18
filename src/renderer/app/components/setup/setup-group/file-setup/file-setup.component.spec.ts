import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FileSetupComponent} from './file-setup.component';

describe('SelectionSetupComponent', () => {
  let component: FileSetupComponent;
  let fixture: ComponentFixture<FileSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [FileSetupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
