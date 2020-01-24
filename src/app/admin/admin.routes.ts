import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminGuard } from '../guards/admin.guard';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { SeguimientoExpedienteComponent } from './seguimiento-expediente/seguimiento-expediente.component';

const ADMIN_ROUTES: Routes = [
    {
        path: 'admin',
        component: DashboardComponent,
        data: { titulo: 'Home' },
        canActivate: [AdminGuard]
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
        data: { titulo: 'Expedientes Detalle' }
    },
    {
        path: 'notificaciones',
        component: NotificacionesComponent,
        data: { titulo: 'Notificaciones' }
    },
    {
        path: '', redirectTo: '/admin',
        pathMatch: 'full'
    }
];

export const ADMIN_ROUTING = RouterModule.forChild(ADMIN_ROUTES);