import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from './core/guards/logged.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashLayoutComponent } from "./layouts/dash-layout/dash-layout.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    path: 'dash',
    component: DashLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/dash-layout/dash-layout.module').then(m => m.DashLayoutModule),
        canLoad: [LoggedGuard],
        canActivate: [LoggedGuard]
      }
    ]
  },{
    path: 'app',
    loadChildren: () => import('./pages/app/app.module').then(m => m.AppModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth/sign-in',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    relativeLinkResolution: 'legacy',
    useHash: false,

  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
