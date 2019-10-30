import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';

const APP_ROUTES: Routes = [
    {
        path: '',
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModule'
    },
    {
        path: '**', component: NopagefoundComponent
    }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true});