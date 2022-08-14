import { Action } from "@ngrx/store";

export enum SingleLayoutActionTypes {
  SET_ACTIVE = "[SingleLayout] SetActive",
}

export class SetActive implements Action {
  readonly type = SingleLayoutActionTypes.SET_ACTIVE;

  constructor(public payload: boolean) {}
}

export type SingleLayoutActions = SetActive;
