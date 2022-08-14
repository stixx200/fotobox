import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollageImageComponent } from "./collage-image.component";

describe("CollageImageComponent", () => {
  let component: CollageImageComponent;
  let fixture: ComponentFixture<CollageImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollageImageComponen, t],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollageImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
