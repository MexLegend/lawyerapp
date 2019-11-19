import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticulosComponent } from './articulos/articulos.component';

const ADMIN_ROUTES: Routes = [
    {
        path: 'admin/articulos',
        component: ArticulosComponent,
        data: { titulo: 'Articulos' }
    },
    {
        path: 'admin',
        component: DashboardComponent
    },
    {
        path: '', redirectTo: '/admin',
        pathMatch: 'full'
    }
];

export const ADMIN_ROUTING = RouterModule.forChild(ADMIN_ROUTES);