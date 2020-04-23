import { RouterModule, Routes } from '@angular/router';

import { LoginGuard } from '../guards/login.guard';
import { ContactComponent } from '../pages/contact/contact.component';
import { HomeComponent } from '../pages/home/home.component';
import { PerfilComponent } from '../pages/perfil/perfil.component';
import { ConfGeneralComponent } from '../pages/perfil/perfilPages/conf-general/conf-general.component';
import { EventosComponent } from '../pages/perfil/perfilPages/eventos/eventos.component';
import { ExpedienteDetalleComponent } from '../pages/perfil/perfilPages/expediente-detalle/expediente-detalle.component';
import { ExpedientesComponent } from '../pages/perfil/perfilPages/expedientes/expedientes.component';
import { InformacionComponent } from '../pages/perfil/perfilPages/informacion/informacion.component';
import { MensajesComponent } from '../pages/perfil/perfilPages/mensajes/mensajes.component';
import { SeguridadComponent } from '../pages/perfil/perfilPages/seguridad/seguridad.component';
import { PostDetailComponent } from '../pages/post-detail/post-detail.component';
import { PostsUComponent } from '../pages/postsU/postsU.component';

const PAGES_ROUTES: Routes = [
    {
        path: 'articulo-detalle/:id',
        component: PostDetailComponent
    },
    {
        path: 'articulos',
        component: PostsUComponent
    },
    {
        path: 'contacto',
        component: ContactComponent
    },
    {
        path: 'inicio',
        component: HomeComponent
    },
    {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [LoginGuard],
        children: [
            {
                path: '',
                component: ConfGeneralComponent
            },
            {
                path: 'general',
                component: ConfGeneralComponent
            },
            {
                path: 'eventos',
                component: EventosComponent
            },
            {
                path: 'expediente-detalle/:id',
                component: ExpedienteDetalleComponent
            },
            {
                path: 'expedientes',
                component: ExpedientesComponent
            },
            {
                path: 'informacion',
                component: InformacionComponent
            },
            {
                path: 'mensajes',
                component: MensajesComponent
            },
            {
                path: 'seguridad',
                component: SeguridadComponent
            },
        ]
    },
    {
        path: '', redirectTo: '/inicio',
        pathMatch: 'full'
    }
];

export const CLIENTE_ROUTING = RouterModule.forChild(PAGES_ROUTES);