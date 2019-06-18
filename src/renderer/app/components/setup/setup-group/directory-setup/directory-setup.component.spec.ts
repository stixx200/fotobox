import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DirectorySetupComponent} from './directory-setup.component';

describe('SelectionSetupComponent', () => {
  let component: DirectorySetupComponent;
  let fixture: ComponentFixture<DirectorySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [DirectorySetupComponent],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
