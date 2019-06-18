import {Action} from '@ngrx/store';

export enum MainConfigurationActionTypes {
  SET_CAMERA_DRIVERS = '[MainConfiguration] SetCameraDrivers',
  SET_SELECTED_DRIVER = '[MainConfiguration] SetSelectedDriver',
  SET_IRFANVIEW_PATH = '[MainConfiguration] SetIrfanViewPath',
  SET_USE_PRINTER = '[MainConfiguration] SetUsePrinter',
  SET_PHOTO_DIR = '[MainConfiguration] SetPhotoDir',
  SET_SONYPASSWORD = '[MainConfiguration] SetSonyPassword',
}

export class SetCameraDrivers implements Action {
  readonly type = MainConfigurationActionTypes.SET_CAMERA_DRIVERS;

  constructor(public payload: string[]) {
  }
}

export class SetSelectedDriver implements Action {
  readonly type = MainConfigurationActionTypes.SET_SELECTED_DRIVER;

  constructor(public payload: string) {
  }
}

export class SetIrfanViewPath implements Action {
  readonly type = MainConfigurationActionTypes.SET_IRFANVIEW_PATH;

  constructor(public payload: string) {
  }
}

export class SetUsePrinter implements Action {
  readonly type = MainConfigurationActionTypes.SET_USE_PRINTER;

  constructor(public payload: boolean) {
  }
}

export class SetPhotoDir implements Action {
  readonly type = MainConfigurationActionTypes.SET_PHOTO_DIR;

  constructor(public payload: string) {
  }
}

export class SetSonyPassword implements Action {
  readonly type = MainConfigurationActionTypes.SET_SONYPASSWORD;

  constructor(public payload: string) {
  }
}

export type MainConfigurationActions =
  SetCameraDrivers |
  SetSelectedDriver |
  SetIrfanViewPath |
  SetUsePrinter |
  SetPhotoDir |
  SetSonyPassword;
