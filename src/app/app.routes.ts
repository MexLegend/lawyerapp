import { Routes, RouterModule } from '@angular/router';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { ClientesComponent } from './clientes/clientes.component';
import { AdminModule } from './admin/admin.module';

const APP_ROUTES: Routes = [

    {
        path: '',
        component: ClientesComponent,
        loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)

    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)

    },
    {
        path: '**', component: NopagefoundComponent
    }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true});