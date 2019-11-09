import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

export const ADMIN_ROUTING = RouterModule.forChild(ADMIN_ROUTES);