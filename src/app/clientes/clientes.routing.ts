import { Routes, RouterModule } from '@angular/router';
import { ContactoComponent } from '../pages/contacto/contacto.component';
import { NoticiasComponent } from '../pages/noticias/noticias.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { PerfilComponent } from '../pages/perfil/perfil.component';
import { LoginGuard } from '../guards/login.guard';
import { ConfGeneralComponent } from '../pages/perfil/perfilPages/conf-general/conf-general.component';
import { CambiarPassComponent } from '../pages/perfil/perfilPages/cambiar-pass/cambiar-pass.component';
import { InformacionComponent } from '../pages/perfil/perfilPages/informacion/informacion.component';
import { SocialComponent } from '../pages/perfil/perfilPages/social/social.component';
import { EventosComponent } from '../pages/perfil/perfilPages/eventos/eventos.component';
import { ExpedientesComponent } from '../pages/perfil/perfilPages/expedientes/expedientes.component';
import { ExpedienteDetalleComponent } from '../pages/perfil/perfilPages/expediente-detalle/expediente-detalle.component';

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
                path: 'cambiar-password',
                component: CambiarPassComponent
            },
            {
                path: 'informacion',
                component: InformacionComponent
            },
            {
                path: 'social',
                component: SocialComponent
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
        path: '', redirectTo: '/inicio',
        pathMatch: 'full'
    }
];

export const CLIENTE_ROUTING = RouterModule.forChild(PAGES_ROUTES);