import { ActionReducerMap } from '@ngrx/store';

import * as fromGlobal from './global.reducer';
import * as fromMainConfiguration from './mainConfiguration.reducers';
import * as fromCollageLayout from '../layouts/collage-layout/store/collage-layout.reducer';
import * as fromSingleLayout from '../layouts/single-layout/store/single-layout.reducer';

export interface AppState {
  global: fromGlobal.State;
  collageLayout: fromCollageLayout.State;
  singleLayout: fromSingleLayout.State;
  mainConfiguration: fromMainConfiguration.State;
}

export const reducers: ActionReducerMap<AppState> = {
  global: fromGlobal.globalReducer,
  mainConfiguration: fromMainConfiguration.mainConfigurationReducer,
  collageLayout: fromCollageLayout.collageLayoutReducer,
  singleLayout: fromSingleLayout.singleLayoutReducer,
};
