import { Routes } from '@angular/router';

export const DashLayoutRoutes: Routes = [
    { path: 'home', loadChildren: () => import('../../pages/home/home.module').then(m => m.HomeModule) },
    { path: 'usuarios', loadChildren: () => import('../../pages/users/users.module').then(m => m.UsersModule) },
    { path: 'estudiantes', loadChildren: () => import('../../pages/clients/clients.module').then(m => m.ClientsModule) },
    { path: 'carreras', loadChildren: () => import('../../pages/college-career/college-career.module').then(m => m.CollegeCareerModule) },
    { path: 'ofertas', loadChildren: () => import('../../pages/offers/offers.module').then(m => m.OffersModule) },
    { path: 'cursoss&Workshops', loadChildren: () => import('../../pages/courses/courses.module').then(m => m.CoursesModule) },
    { path: 'opiniones', loadChildren: () => import('../../pages/opinions/opinions.module').then(m => m.OpinionsModule) },
    // { path: 'balance', loadChildren: () => import('../../pages/balance/balance.module').then(m => m.BalanceModule) },
    { path: 'ofertas-laborales', loadChildren: () => import('../../pages/job-offers/job-offers.module').then(m => m.JobOffersModule) },
    { path: 'recursos', loadChildren: () => import('../../pages/resources/resources.module').then(m => m.ResourcesModule) },
    { path: 'noticias', loadChildren: () => import('../../pages/notice/notice.module').then(m => m.NoticeModule) },
    { path: 'anuncios', loadChildren: () => import('../../pages/ad-page/ad-page.module').then(m => m.AdPageModule) },
    // { path: 'objestos-perdidos', loadChildren: () => import('../../pages/lost-object/lost-object.module').then(m => m.LostObjectModule) },
    // { path: 'configuraciones', loadChildren: () => import('../../pages/settings/settings.module').then(m => m.SettingsModule) },
];
