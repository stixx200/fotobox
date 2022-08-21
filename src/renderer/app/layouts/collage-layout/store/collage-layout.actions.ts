import { Action } from "@ngrx/store";

export enum CollageLayoutActionTypes {
  SET_ACTIVE = "[CollageLayout] SetActive",
  SET_TEMPLATES = "[CollageLayout] SetTemplates",
  SET_TEMPLATES_DIR = "[CollageLayout] SetTemplatesDir",
  SET_SELECTED_TEMPLATES = "[CollageLayout] SetSelectedTemplates",
}

export class SetActive implements Action {
  readonly type = CollageLayoutActionTypes.SET_ACTIVE;

  constructor(public payload: boolean) {}
}

export class SetTemplates implements Action {
  readonly type = CollageLayoutActionTypes.SET_TEMPLATES;

  constructor(public payload: string[]) {}
}

export class SetTemplatesDir implements Action {
  readonly type = CollageLayoutActionTypes.SET_TEMPLATES_DIR;

  constructor(public payload: string) {}
}

export class SetSelectedTemplates implements Action {
  readonly type = CollageLayoutActionTypes.SET_SELECTED_TEMPLATES;

  constructor(public payload: string[]) {}
}

export type CollageLayoutActions = SetActive | SetTemplates | SetTemplatesDir | SetSelectedTemplates;
