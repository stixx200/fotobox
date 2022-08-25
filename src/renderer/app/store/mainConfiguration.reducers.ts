import { MainConfigurationActions, MainConfigurationActionTypes } from "./mainConfiguration.actions";

export interface State {
  cameraDrivers: string[];
  selectedDriver: string;
  selectedPrinter: string;
  availablePrinters: string[];
  usePrinter: boolean;
  photoDir: string;
  wifiControl: boolean;
  sonyPassword: string;
  shutterTimeout: number;
}

const initialState: State = {
  cameraDrivers: [],
  selectedDriver: null,
  selectedPrinter: null,
  availablePrinters: [],
  usePrinter: true,
  photoDir: "",
  wifiControl: true,
  sonyPassword: "",
  shutterTimeout: 3,
};

export function mainConfigurationReducer(state = initialState, action: MainConfigurationActions): State {
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
    case MainConfigurationActionTypes.SET_AVAILABLE_PRINTERS:
      return {
        ...state,
        availablePrinters: action.payload,
      };
    case MainConfigurationActionTypes.SET_SELECTED_PRINTER:
      return {
        ...state,
        selectedPrinter: action.payload,
      };
    case MainConfigurationActionTypes.SET_USE_PRINTER:
      return {
        ...state,
        usePrinter: action.payload,
      };
    case MainConfigurationActionTypes.SET_PHOTO_DIR:
      return {
        ...state,
        photoDir: action.payload,
      };
    case MainConfigurationActionTypes.SET_SONYPASSWORD:
      return {
        ...state,
        sonyPassword: action.payload,
      };
    case MainConfigurationActionTypes.SET_WIFICONTROL:
      return {
        ...state,
        wifiControl: action.payload,
      };
    case MainConfigurationActionTypes.SET_SHUTTERTIMEOUT:
      return {
        ...state,
        shutterTimeout: action.payload,
      };

    default:
      return state;
  }
}
