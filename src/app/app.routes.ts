import { Routes, RouterModule } from '@angular/router';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { ClientesComponent } from './clientes/clientes.component';
import { AdminComponent } from './admin/admin.component';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './login/login.component';

const APP_ROUTES: Routes = [

    {
        path: '',
        component: AdminComponent,
        canActivate: [LoginGuard],
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)

    },
    {
        path: '',
        component: ClientesComponent,
        loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)

    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: '**', component: NopagefoundComponent
    }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true});