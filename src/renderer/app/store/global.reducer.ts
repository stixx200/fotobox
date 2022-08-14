import { GlobalActions, GlobalActionTypes } from "./global.actions";

export interface State {
  title: string;
}

const initialState: State = {
  title: "TITLES.FOTOBOX",
};

export function globalReducer(state = initialState, action: GlobalActions) {
  switch (action.type) {
    case GlobalActionTypes.SET_TITLE:
      return {
        ...state,
        title: action.payload,
      };

    default:
      return state;
  }
}
