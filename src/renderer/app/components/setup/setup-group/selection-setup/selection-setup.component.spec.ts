import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectionSetupComponent } from "./selection-setup.component";

describ'SelectionSetupComponent't", () => {
  let component: SelectionSetupComponent;
  let fixture: ComponentFixture<SelectionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectionSetupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
