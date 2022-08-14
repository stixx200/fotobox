import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SingleLayoutComponent } from "./single-layout.component";

describe("SingleLayoutComponent", () => {
  let component: SingleLayoutComponent;
  let fixture: ComponentFixture<SingleLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleLayoutComponen, t],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
