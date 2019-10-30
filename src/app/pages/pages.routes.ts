import { Routes, RouterModule } from '@angular/router';
import { ContactoComponent } from './contacto/contacto.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { InicioComponent } from './inicio/inicio.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const PAGES_ROUTES: Routes = [
    {
        path: 'contacto',
        component: ContactoComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'inicio',
        component: InicioComponent
    },
    {
        path: 'noticias',
        component: NoticiasComponent
    },
    {
        path: '', redirectTo: '/inicio',
        pathMatch: 'full'
    }
];

export const PAGES_ROUTING = RouterModule.forChild(PAGES_ROUTES);