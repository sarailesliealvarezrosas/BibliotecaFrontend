import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule, NgbTypeaheadModule, NgbPaginationModule, NgbModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FlatpickrModule } from 'angularx-flatpickr';
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';
import { SharedModule } from '../../shared/shared.module';
import { ToastsContainer } from './toasts-container.component';


@NgModule({
  declarations: [
    ToastsContainer
  ],
  exports: [] ,
  imports: [
    CommonModule,
    FormsModule,
    CountUpModule,
    ReactiveFormsModule,
    FeatherModule.pick(allIcons),
    FlatpickrModule.forRoot(),
    NgbModule,
    NgbToastModule,
    NgbDropdownModule,
    NgbNavModule,
    NgApexchartsModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    SimplebarAngularModule,
    SlickCarouselModule,
    LeafletModule,
    TranslateModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardsModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
