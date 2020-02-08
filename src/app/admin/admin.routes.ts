import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminGuard } from '../guards/admin.guard';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { SeguimientoExpedienteComponent } from './seguimiento-expediente/seguimiento-expediente.component';
import { MensajesComponent } from './mensajes/mensajes.component';

const ADMIN_ROUTES: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' },
        canActivate: [AdminGuard]
    },
    {
        path: 'mensajes',
        component: MensajesComponent,
        data: { titulo: 'Mensajes' },
    },
    {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Usuarios' }
    },
    {
        path: 'articulos',
        component: ArticulosComponent,
        data: { titulo: 'Articulos' }
    },
    {
        path: 'expedientes',
        component: ExpedientesComponent,
        data: { titulo: 'Expedientes' }
    },
    {
        path: 'seguimiento-expediente',
        component: SeguimientoExpedienteComponent,
        data: { titulo: 'Seguimiento Expediente' }
    },
    {
        path: 'notificaciones',
        component: NotificacionesComponent,
        data: { titulo: 'Notificaciones' }
    },
    {
        path: '', redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];

export const ADMIN_ROUTING = RouterModule.forChild(ADMIN_ROUTES);