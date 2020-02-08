import { Routes, RouterModule } from '@angular/router';
import { ContactoComponent } from '../pages/contacto/contacto.component';
import { NoticiasComponent } from '../pages/noticias/noticias.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { PerfilComponent } from '../pages/perfil/perfil.component';
import { LoginGuard } from '../guards/login.guard';
import { ConfGeneralComponent } from '../pages/perfil/perfilPages/conf-general/conf-general.component';
import { SeguridadComponent } from '../pages/perfil/perfilPages/seguridad/seguridad.component';
import { InformacionComponent } from '../pages/perfil/perfilPages/informacion/informacion.component';
import { MensajesComponent } from '../pages/perfil/perfilPages/mensajes/mensajes.component';
import { EventosComponent } from '../pages/perfil/perfilPages/eventos/eventos.component';
import { ExpedientesComponent } from '../pages/perfil/perfilPages/expedientes/expedientes.component';
import { ExpedienteDetalleComponent } from '../pages/perfil/perfilPages/expediente-detalle/expediente-detalle.component';
import { NoticiaDetalleComponent } from '../pages/noticia-detalle/noticia-detalle.component';

const PAGES_ROUTES: Routes = [
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
                path: 'seguridad',
                component: SeguridadComponent
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
                path: 'eventos',
                component: EventosComponent
            },
            {
                path: 'expedientes',
                component: ExpedientesComponent
            },
            {
                path: 'expediente-detalle/:id',
                component: ExpedienteDetalleComponent
            }
        ]
    },
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
        path: 'noticia-detalle/:id',
        component: NoticiaDetalleComponent
    },
    {
        path: '', redirectTo: '/inicio',
        pathMatch: 'full'
    }
];

export const CLIENTE_ROUTING = RouterModule.forChild(PAGES_ROUTES);