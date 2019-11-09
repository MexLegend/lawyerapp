import { Routes, RouterModule } from '@angular/router';
import { ContactoComponent } from '../pages/contacto/contacto.component';
import { NoticiasComponent } from '../pages/noticias/noticias.component';
import { InicioComponent } from '../pages/inicio/inicio.component';

const PAGES_ROUTES: Routes = [
    {
        path: 'contacto',
        component: ContactoComponent
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

export const CLIENTE_ROUTING = RouterModule.forChild(PAGES_ROUTES);