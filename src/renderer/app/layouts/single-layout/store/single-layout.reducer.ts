import { SafeResourceUrl } from "@angular/platform-browser";
import { SingleLayoutActions, SingleLayoutActionTypes } from "./single-layout.actions";

export interface State {
  previewUrl: SafeResourceUrl;
  title: string;
  route: string;
  active: boolean;
}

const initialState: State = {
  previewUrl: "../../../assets/singlelayout.preview.jpg",
  title: "PAGES.SETUP.FOTOBOX.LAYOUTS.SINGLE",
  route: "/layouts/single",
  active: true,
};

export function singleLayoutReducer(state = initialState, action: SingleLayoutActions) {
  switch (action.type) {
    case SingleLayoutActionTypes.SET_ACTIVE:
      return {
        ...state,
        active: action.payload,
      };

    default:
      return state;
  }
}
