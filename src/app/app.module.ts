// import { LOCALE_ID, NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { NgPipesModule } from 'ngx-pipes';
// import { EffectsModule } from '@ngrx/effects';

// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import localeEs from '@angular/common/locales/es';
// import { registerLocaleData } from '@angular/common';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';

// import { ErrorInterceptor } from './core/helpers/error.interceptor';

// import { RouterOutlet } from "@angular/router";

// registerLocaleData(localeEs, 'es');

// export function createTranslateLoader(http: HttpClient): any {
//   return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
// }
// @NgModule({ 
//     declarations: [AppComponent],
//     bootstrap: [AppComponent], 
//     imports: [RouterOutlet],
//         providers: [
//             { provide: LOCALE_ID, useValue: 'es' },
//           //  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
//             { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
//         provideHttpClient(withInterceptorsFromDi()),
//         ]
//      })
// export class AppModule { }


import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgPipesModule } from 'ngx-pipes';
import { EffectsModule } from '@ngrx/effects';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsModule } from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";

import { environment } from '../environments/environment';
import { ErrorInterceptor } from './core/helpers/error.interceptor';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { rootReducer } from './store';
import { AuthInterceptor } from './core/helpers/auth.interceptor';
import { DashboardsModule } from './pages/dashboards/dashboards.module';

registerLocaleData(localeEs, 'es');

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({ 
    declarations: [AppComponent],
    bootstrap: [AppComponent], 
    imports: [
        TranslateModule.forRoot({
            defaultLanguage: 'es',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        BrowserAnimationsModule,
        BrowserModule,  
        // HttpClientModule,
        AppRoutingModule,
        LayoutsModule,
        PagesModule,
        NgPipesModule,
        StoreModule.forRoot(rootReducer),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
        EffectsModule.forRoot([
        ]),
        DashboardsModule],
        providers: [
            { provide: LOCALE_ID, useValue: 'es' },
            { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
            { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        ]
     })
export class AppModule { }
