import { Action } from "@ngrx/store";

export enum MainConfigurationActionTypes {
  SET_CAMERA_DRIVERS = "[MainConfiguration] SetCameraDrivers",
  SET_SELECTED_DRIVER = "[MainConfiguration] SetSelectedDriver",
  SET_SELECTED_PRINTER = "[MainConfiguration] SetSelectedPrinter",
  SET_USE_PRINTER = "[MainConfiguration] SetUsePrinter",
  SET_PHOTO_DIR = "[MainConfiguration] SetPhotoDir",
  SET_SONYPASSWORD = "[MainConfiguration] SetSonyPassword",
  SET_WIFICONTROL = "[MainConfiguration] SetWifiControl",
  SET_SHUTTERTIMEOUT = "[MainConfiguration] SetShutterTmeout",
  SET_AVAILABLE_PRINTERS = "[MainConfiguration] SetAvailablePrinters",
}

export class SetCameraDrivers implements Action {
  readonly type = MainConfigurationActionTypes.SET_CAMERA_DRIVERS;

  constructor(public payload: string[]) {}
}

export class SetSelectedDriver implements Action {
  readonly type = MainConfigurationActionTypes.SET_SELECTED_DRIVER;

  constructor(public payload: string) {}
}

export class SetSelectedPrinter implements Action {
  readonly type = MainConfigurationActionTypes.SET_SELECTED_PRINTER;

  constructor(public payload: string) {}
}

export class SetUsePrinter implements Action {
  readonly type = MainConfigurationActionTypes.SET_USE_PRINTER;

  constructor(public payload: boolean) {}
}

export class SetPhotoDir implements Action {
  readonly type = MainConfigurationActionTypes.SET_PHOTO_DIR;

  constructor(public payload: string) {}
}

export class SetSonyPassword implements Action {
  readonly type = MainConfigurationActionTypes.SET_SONYPASSWORD;

  constructor(public payload: string) {}
}

export class SetWifiControl implements Action {
  readonly type = MainConfigurationActionTypes.SET_WIFICONTROL;

  constructor(public payload: boolean) {}
}

export class SetShutterTimeout implements Action {
  readonly type = MainConfigurationActionTypes.SET_SHUTTERTIMEOUT;

  constructor(public payload: number) {}
}

export class SetAvailablePrinters implements Action {
  readonly type = MainConfigurationActionTypes.SET_AVAILABLE_PRINTERS;

  constructor(public payload: string[]) {}
}

export type MainConfigurationActions =
  | SetCameraDrivers
  | SetSelectedDriver
  | SetSelectedPrinter
  | SetUsePrinter
  | SetPhotoDir
  | SetSonyPassword
  | SetWifiControl
  | SetShutterTimeout
  | SetAvailablePrinters;
