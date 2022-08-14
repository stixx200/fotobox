import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MessageStripeComponent } from "./message-stripe.component";

describe("MessageStripeComponent", () => {
  let component: MessageStripeComponent;
  let fixture: ComponentFixture<MessageStripeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageStripeComponen, t],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
