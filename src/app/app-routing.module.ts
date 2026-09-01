import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
//import { AuthGuard } from './core/guards/auth.guard';
//import { NoAuthGuard } from './core/guards/no-auth.guard';
import { DashboardComponent } from './pages/dashboards/dashboard/dashboard.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { SettingsComponent } from './pages/account/settings/settings.component';
/* MODULES */
import { ActivitiesComponent } from './pages/modules/activities/activities.component';


const routes: Routes = 
[
  /* MODULES */
  {
      path: '',
      component: LayoutComponent,
     // canActivate: [AuthGuard],
    //  canActivateChild: [AuthGuard],
      children: [
          {path: '', component: DashboardComponent},
          {path: 'auth/profile', component: ProfileComponent,data: { requiredPermission: 'CAN_ACCESS' },},
          {path: 'auth/profile-setting', component: SettingsComponent,data: { requiredPermission: 'CAN_ACCESS' },},
      ]
  },
  {
    path: 'admin',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    //canActivateChild: [AuthGuard],
    children: [ 
      { path: 'activities', component: ActivitiesComponent},

    ]
  },
  {
    path: 'settings',
    component: LayoutComponent,
   // canActivate: [AuthGuard],
  //  canActivateChild: [AuthGuard],
    children: [ 
 
    ]
  },
 
  {
    path: 'reports',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    //canActivateChild: [AuthGuard],
    children: [ 
 
  
      ]
  },

  /*EXTRA PAGES  */
  {
    path: 'pages',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    //canActivateChild: [AuthGuard],
    data: { requiredPermission: 'CAN_ACCESS' },
    children: [
      { path: '', loadChildren: () => import('./pages/extrapages/extraspages.module').then(m => m.ExtraspagesModule), },
    ]
  },
  /* PUBLIC ACCES */
  //{
    //path: 'auth',
    //canActivate: [NoAuthGuard], 
   // loadChildren: () => import('./public/account/account.module').then(m => m.AccountModule),
 // },
  { path: 'public', loadChildren: () => import('./public/extraspages/extraspages.module').then(m => m.ExtraspagesModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
