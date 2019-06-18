import {SafeResourceUrl} from '@angular/platform-browser';
import {CollageLayoutActions, CollageLayoutActionTypes} from './collage-layout.actions';

export interface State {
  previewUrl: SafeResourceUrl;
  title: string;
  route: string;
  active: boolean;
  templateId: string;
  templates: string[];
}

const initialState: State = {
  previewUrl: '../../../assets/collagelayout.preview.jpg',
  title: 'PAGES.SETUP.FOTOBOX.LAYOUTS.COLLAGE',
  route: '/layouts/collage',
  active: true,
  templateId: 'christina_martin_2019.ts',
  templates: ['christina_martin_2019.ts'],
};

export function collageLayoutReducer(state = initialState, action: CollageLayoutActions) {
  switch (action.type) {
    case CollageLayoutActionTypes.SET_ACTIVE:
      return {
        ...state,
        active: action.payload,
      };

    case CollageLayoutActionTypes.SET_TEMPLATES:
      return {
        ...state,
        templates: action.payload,
      };

    case CollageLayoutActionTypes.SET_TEMPLATE:
      return {
        ...state,
        templateId: action.payload,
      };

    default:
      return state;
  }
}
