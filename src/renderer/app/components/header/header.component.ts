import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as fromApp from "../../store/app.reducer";
import * as fromGlobal from "../../store/global.reducer";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  globalState: Observable<fromGlobal.State>;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.globalState = this.store.select("global");
  }
}
