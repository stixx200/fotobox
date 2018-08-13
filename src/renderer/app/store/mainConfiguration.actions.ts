import {Action} from '@ngrx/store';

export enum MainConfigurationActionTypes {
  SET_CAMERA_DRIVERS = '[MainConfiguration] SetCameraDrivers',
  SET_SELECTED_DRIVER = '[MainConfiguration] SetSelectedDriver',
  SET_IRFANVIEW_PATH = '[MainConfiguration] SetIrfanViewPath',
  SET_PHOTO_DIR = '[MainConfiguration] SetPhotoDir',
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

export class SetPhotoDir implements Action {
  readonly type = MainConfigurationActionTypes.SET_PHOTO_DIR;

  constructor(public payload: string) {
  }
}

export type MainConfigurationActions = SetCameraDrivers | SetSelectedDriver | SetIrfanViewPath | SetPhotoDir;
