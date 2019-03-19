import {Action} from '@ngrx/store';
import {CollageText} from '../../../../../main/collage-maker/template.interface';

export enum CollageLayoutActionTypes {
  SET_TEXT = '[CollageLayout] SetText',
  SET_ACTIVE = '[CollageLayout] SetActive',
  SET_TEMPLATES = '[CollageLayout] SetTemplates',
  SET_TEMPLATE = '[CollageLayout] SetTemplate',
}

export class SetText implements Action {
  readonly type = CollageLayoutActionTypes.SET_TEXT;

  constructor(public payload: CollageText[]) {
  }
}

export class SetActive implements Action {
  readonly type = CollageLayoutActionTypes.SET_ACTIVE;

  constructor(public payload: boolean) {
  }
}

export class SetTemplates implements Action {
  readonly type = CollageLayoutActionTypes.SET_TEMPLATES;

  constructor(public payload: string[]) {
  }
}

export class SetTemplate implements Action {
  readonly type = CollageLayoutActionTypes.SET_TEMPLATE;

  constructor(public payload: string) {
  }
}

export type CollageLayoutActions = SetText | SetActive | SetTemplates | SetTemplate;
