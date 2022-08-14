import { Action } from "@ngrx/store";

export enum GlobalActionTypes {
  SET_TITLE = "[Global] SetTitle",
}

export class SetTitle implements Action {
  readonly type = GlobalActionTypes.SET_TITLE;

  constructor(public payload: string) {}
}

export type GlobalActions = SetTitle;
