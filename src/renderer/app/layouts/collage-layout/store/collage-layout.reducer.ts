import { SafeResourceUrl } from "@angular/platform-browser";
import * as _ from "lodash";
import { CollageLayoutActions, CollageLayoutActionTypes } from "./collage-layout.actions";

export interface State {
  previewUrl: SafeResourceUrl;
  title: string;
  route: string;
  active: boolean;
  templatesDirectory: string;
  selectedTemplates: string[];
  templates: string[];
}

const initialState: State = {
  previewUrl: "../../../assets/collagelayout.preview.jpg",
  title: "PAGES.SETUP.FOTOBOX.LAYOUTS.COLLAGE",
  route: "/layouts/collage",
  active: true,
  templatesDirectory: "",
  selectedTemplates: [],
  templates: [],
};

export function collageLayoutReducer(state = initialState, action: CollageLayoutActions): State {
  switch (action.type) {
    case CollageLayoutActionTypes.SET_ACTIVE:
      return {
        ...state,
        active: action.payload,
      };

    case CollageLayoutActionTypes.SET_TEMPLATES:
      return {
        ...state,
        // maybe shrink the selected templates if the new available templates don't contain an already selected one
        selectedTemplates: _.intersection(action.payload[0], state.selectedTemplates),
        templates: action.payload,
      };

    case CollageLayoutActionTypes.SET_TEMPLATES_DIR:
      return {
        ...state,
        templatesDirectory: action.payload,
      };

    case CollageLayoutActionTypes.SET_SELECTED_TEMPLATES:
      return {
        ...state,
        selectedTemplates: action.payload,
      };

    default:
      return state;
  }
}
