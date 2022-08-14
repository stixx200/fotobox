import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { BasicSetupConfig } from "../basic-setup-config";

export interface TextsareaSetupConfig extends BasicSetupConfig {
  type: string;
  onChanged: (texts: string[]) => void;
  texts: Observable<string[]>;
}

@Component({
  selector: "app-textsarea-setup",
  templateUrl: "./textsarea-setup.component.html",
  styleUrls: ["./textsarea-setup.component.scss"],
})
export class TextsareaSetupComponent {
  @Input() config: TextsareaSetupConfig;

  constructor() {}

  onTextChanged(index, target: EventTarget) {
    const texts = this.getObservableValue(this.config.texts);
    texts.splice(index, 1, (target as HTMLInputElement).value);
    this.config.onChanged(texts);
  }

  private getObservableValue(observable: Observable<any>): any {
    let value = null;
    const subscription = observable.subscribe((data) => {
      value = data;
    });
    subscription.unsubscribe();
    return value;
  }
}
