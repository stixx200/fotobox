import { SafeResourceUrl } from "@angular/platform-browser";
import { CollageLayoutActions, CollageLayoutActionTypes } from "./collage-layout.actions";

export interface State {
  previewUrl: SafeResourceUrl;
  title: string;
  route: string;
  active: boolean;
  templatesDirectory: string;
  templateId: string;
  templates: string[];
}

const initialState: State = {
  previewUrl: "../../../assets/collagelayout.preview.jpg",
  title: "PAGES.SETUP.FOTOBOX.LAYOUTS.COLLAGE",
  route: "/layouts/collage",
  active: true,
  templatesDirectory: "",
  templateId: "",
  templates: [],
};

export function collageLayoutReducer(state = initialState, action: CollageLayoutActions) {
  switch (action.type) {
    case CollageLayoutActionTypes.SET_ACTIVE:
      return {
        ...state,
        active: action.payload,
      };

    case CollageLayoutActionTypes.SET_TEMPLATES:
      let templateId = state.templateId;
      if (!action.payload.includes(templateId)) {
        templateId = action.payload[0];
      }
      return {
        ...state,
        templateId,
        templates: action.payload,
      };

    case CollageLayoutActionTypes.SET_TEMPLATES_DIR:
      return {
        ...state,
        templatesDirectory: action.payload,
      };

    case CollageLayoutActionTypes.SET_TEMPLATE:
      return {
        ...state,
        templateId: action.payload,
      };

    default:
      return state;
  }
}
