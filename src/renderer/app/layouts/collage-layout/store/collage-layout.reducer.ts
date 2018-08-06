import {SafeResourceUrl} from '@angular/platform-browser';
import {CollageText} from '../../../../../main/collage-maker/template.interface';
import {CollageLayoutActions, CollageLayoutActionTypes} from './collage-layout.actions';

export interface State {
  text: CollageText[];
  previewUrl: SafeResourceUrl;
  title: string;
  route: string;
  templateId: string;
  active: boolean;
}

const initialState: State = {
  text: [{lines: ['Example', 'text'] }],
  previewUrl: '../../../assets/collagelayout.preview.jpg',
  title: 'PAGES.SETUP.FOTOBOX.LAYOUTS.COLLAGE',
  route: '/layouts/collage',
  active: true,
  templateId: 'default',
};

export function collageLayoutReducer(state = initialState, action: CollageLayoutActions) {
  switch (action.type) {
    case CollageLayoutActionTypes.SET_TEXT:
      return {
        ...state,
        text: action.payload,
      };

    case CollageLayoutActionTypes.SET_ACTIVE:
      return {
        ...state,
        active: action.payload,
      };

    default:
      return state;
  }
}
