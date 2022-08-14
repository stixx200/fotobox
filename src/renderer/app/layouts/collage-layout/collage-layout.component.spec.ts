import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollageLayoutComponent } from "./collage-layout.component";

describe("CollageLayoutComponent", () => {
  let component: CollageLayoutComponent;
  let fixture: ComponentFixture<CollageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollageLayoutComponen, t],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
