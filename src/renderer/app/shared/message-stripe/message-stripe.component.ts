import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-message-stripe",
  templateUrl: "./message-stripe.component.html",
  styleUrls: ["./message-stripe.component.scss,"],
})
export class MessageStripeComponent implements OnInit {
  @Input() message: string;
  @Output() action = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  triggerAction() {
    this.action.emit();
  }
}
