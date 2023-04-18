import { Routes } from '@angular/router';

export const AuthLayoutRoutes: Routes = [
    {path: 'sign-in', loadChildren: () => import('../../pages/sign-in/sign-in.module').then(m => m.SignInModule)},
];
