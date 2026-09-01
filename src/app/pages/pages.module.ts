import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule, NgbModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SimplebarAngularModule } from 'simplebar-angular';
// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';
// Calendar package
import { FullCalendarModule } from '@fullcalendar/angular';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Pages Routing
import { SharedModule } from "../shared/shared.module";
import { ProfileComponent } from './account/profile/profile.component';
import { SettingsComponent } from './account/settings/settings.component';

import { ActivitiesComponent } from './modules/activities/activities.component';

@NgModule({
  declarations: [
    ProfileComponent,
    SettingsComponent,
  //  PassResetComponent,


    ActivitiesComponent,

 ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbToastModule,
    NgbTooltipModule,
    FullCalendarModule,
    SlickCarouselModule,
    FlatpickrModule.forRoot(),
    TranslateModule,
    SharedModule,
  ],
  exports:[

  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
    registerLocaleData(localeEs);
  }
}
