import {MainConfigurationActions, MainConfigurationActionTypes} from './mainConfiguration.actions';

export interface State {
  cameraDrivers: string[];
  selectedDriver: string;
  irfanViewPath: string;
  photoDir: string;
}

const initialState: State = {
  cameraDrivers: [],
  selectedDriver: null,
  irfanViewPath: '',
  photoDir: '',
};

export function mainConfigurationReducer(state = initialState, action: MainConfigurationActions) {
  switch (action.type) {
    case MainConfigurationActionTypes.SET_CAMERA_DRIVERS:
      return {
        ...state,
        cameraDrivers: action.payload,
      };
    case MainConfigurationActionTypes.SET_SELECTED_DRIVER:
      return {
        ...state,
        selectedDriver: action.payload,
      };
    case MainConfigurationActionTypes.SET_IRFANVIEW_PATH:
      return {
        ...state,
        irfanViewPath: action.payload,
      };
    case MainConfigurationActionTypes.SET_PHOTO_DIR:
      return {
        ...state,
        photoDir: action.payload,
      };

    default:
      return state;
  }
}
