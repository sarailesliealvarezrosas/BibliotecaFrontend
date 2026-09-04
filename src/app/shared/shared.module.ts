import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CountUpModule } from 'ngx-countup';
import { PrivacyPolicyComponent } from './extraspages/privacy-policy/privacy-policy.component';

import { ScrollspyDirective } from './scrollspy.directive';
import { LandingScrollspyDirective } from './landingscrollspy.directive';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DataHeaderComponent } from './data-header/data-header.component';
import { DataCardsComponent } from './data-cards/data-card.component';
import { LeafletComponent } from './map/leaflet.component';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    ScrollspyDirective,
    LandingScrollspyDirective,
    DataHeaderComponent,
    DataTableComponent,
    DataCardsComponent,
    LeafletComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CountUpModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule,    
    NgbPaginationModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    FlatpickrModule,
    NgSelectModule,
    PrivacyPolicyComponent,
  ],
  providers: [ DatePipe ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    ScrollspyDirective,
    LandingScrollspyDirective,
    BreadcrumbsComponent,
    DataHeaderComponent,
    DataTableComponent,
    DataCardsComponent,
    LeafletComponent,
    PrivacyPolicyComponent,
  ]
})
export class SharedModule { }
