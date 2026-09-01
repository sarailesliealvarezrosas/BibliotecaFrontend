import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule, NgbTypeaheadModule, NgbPaginationModule, NgbModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgSelectModule } from '@ng-select/ng-select';
// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CountUpModule } from 'ngx-countup';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

//Module
import { SharedModule } from '../../shared/shared.module';
// Component
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToastsContainer } from './toasts-container.component';


@NgModule({
  declarations: [
   // DashboardComponent,
    ToastsContainer,
   // AirDashboardComponent,

  ],
  exports: [] ,
  imports: [
    CommonModule,
    FormsModule,
    CountUpModule,
    ReactiveFormsModule,
    // FlatpickrModule,
    FeatherModule.pick(allIcons),
    FlatpickrModule.forRoot(),
    NgbModule,
    // NgSelectModule,
    // NgbTooltipModule,
    NgbToastModule,
    NgbDropdownModule,
    NgbNavModule,
    NgApexchartsModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    // LightboxModule,
    // FullCalendarModule,
    SimplebarAngularModule,
    SlickCarouselModule,
    LeafletModule,
    TranslateModule,
    SharedModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardsModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
