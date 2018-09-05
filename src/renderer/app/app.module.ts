import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {localStorageSync} from 'ngrx-store-localstorage';
import {ModalModule} from 'ngx-bootstrap/modal';

import 'reflect-metadata';
import 'zone.js/dist/zone-mix';
import {AppConfig} from '../environments/environment';
import '../polyfills';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {HomeComponent} from './components/home/home.component';
import {PhotoListComponent} from './components/photo-list.ts/photo-list.component';
import {SetupComponent} from './components/setup/setup.component';
import {CollageImageComponent} from './layouts/collage-layout/collage-image/collage-image.component';

import {CollageLayoutComponent} from './layouts/collage-layout/collage-layout.component';
import {SingleLayoutComponent} from './layouts/single-layout/single-layout.component';
import {MaterialModule} from './material/material.module';

import {ElectronService} from './providers/electron.service';
import {FilepickerService} from './providers/filepicker.service';
import {IpcRendererService} from './providers/ipc.renderer.service';
import {MessageStripeComponent} from './shared/message-stripe/message-stripe.component';
import {PhotoViewComponent} from './shared/photo-view/photo-view.component';
import {reducers} from './store/app.reducer';
import { CountdownComponent } from './app/countdown/countdown.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['global', 'collageLayout', 'singleLayout', 'mainConfiguration'],
    rehydrate: true,
  })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SetupComponent,
    HeaderComponent,
    SingleLayoutComponent,
    CollageLayoutComponent,
    PhotoViewComponent,
    MessageStripeComponent,
    CollageImageComponent,
    PhotoListComponent,
    CountdownComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    // design
    MaterialModule,
    // others
    ModalModule.forRoot(),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot(reducers, {metaReducers}),
    !AppConfig.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    ElectronService,
    IpcRendererService,
    FilepickerService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
