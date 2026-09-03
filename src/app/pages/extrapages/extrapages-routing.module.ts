import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { SitemapComponent } from "./sitemap/sitemap.component";
import { SearchResultsComponent } from "./search-results/search-results.component";
import { ExtraPagesComponent } from './extra-pages-in/extra-pages-layout.component';

const routes: Routes = [
  {
    path: 'privacy-policy-in',
    component: ExtraPagesComponent,
    data: { pageType: 'privacyPolicy', title: 'Política de Privacidad' }
  },
  {
    path: 'terms-condition-in',
    component: ExtraPagesComponent,
    data: { pageType: 'termsConditions', title: 'Términos & Condiciones de Uso' }
  },
  {
    path: 'sitemap',
    component: SitemapComponent
  },
  {
    path: 'search-results',
    component: SearchResultsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraPagesRoutingModule { }
