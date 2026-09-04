import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AutoresComponent } from './pages/modules/autores/autores.component';
import { DashboardComponent } from './pages/dashboards/dashboard/dashboard.component';
import { ActivitiesComponent } from './pages/modules/activities/activities.component';
import { CategoriasComponent } from './pages/modules/categorias/categorias.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
    ]
  },

  {
    path: 'biblioteca',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'autores', component: AutoresComponent },
      { path: 'categorias', component: CategoriasComponent },
     // { path: 'libros', component: LibrosComponent },
      //{ path: 'subcategorias', component: SubcategoriasComponent },
     // { path: 'ubicaciones', component: UbicacionesComponent },
     // { path: 'lectores', component: LectoresComponent },
      { path: '', redirectTo: 'libros', pathMatch: 'full' },
    ]
  },

  {
    path: 'prestamos',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
   
      { path: '', redirectTo: 'nuevo', pathMatch: 'full' },
    ]
  },

  {
    path: 'reportes',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'libros-categoria', pathMatch: 'full' },
    ]
  },

  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'activities', component: ActivitiesComponent },
      { path: '', redirectTo: 'activities', pathMatch: 'full' },
    ]
  },

  {
    path: 'settings',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: []
  },
  {
    path: 'pages',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { requiredPermission: 'CAN_ACCESS' },
    children: [
      { path: '', loadChildren: () => import('./pages/extrapages/extraspages.module').then(m => m.ExtraspagesModule) },
    ]
  },
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./public/account/account.module').then(m => m.AccountModule),
  },
  { 
    path: 'public', 
    loadChildren: () => import('./public/extraspages/extraspages.module').then(m => m.ExtraspagesModule) 
  },
  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }