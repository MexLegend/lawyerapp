import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminGuard } from '../guards/admin.guard';

const ADMIN_ROUTES: Routes = [
    {
        path: 'articulos',
        component: ArticulosComponent,
        data: { titulo: 'Articulos' }
    },
    {
        path: 'admin',
        component: DashboardComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Usuarios' }
    },
    {
        path: '', redirectTo: '/admin',
        pathMatch: 'full'
    }
];

export const ADMIN_ROUTING = RouterModule.forChild(ADMIN_ROUTES);