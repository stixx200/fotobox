import { Action } from '@ngrx/store';
import {CollageText} from '../../../../../main/collage-maker/template.interface';

export enum CollageLayoutActionTypes {
  SET_TEXT = '[CollageLayout] SetText',
  SET_ACTIVE = '[CollageLayout] SetActive',
}

export class SetText implements Action {
  readonly type = CollageLayoutActionTypes.SET_TEXT;

  constructor(public payload: CollageText[]) {}
}

export class SetActive implements Action {
  readonly type = CollageLayoutActionTypes.SET_ACTIVE;

  constructor(public payload: boolean) {}
}

export type CollageLayoutActions = SetText | SetActive;
