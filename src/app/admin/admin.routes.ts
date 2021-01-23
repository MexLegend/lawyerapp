import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FilesComponent } from './files/files.component';
import { AdminGuard } from '../guards/admin.guard';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostsComponent } from './posts/posts.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';

const ADMIN_ROUTES: Routes = [
    {
        path: 'profile',
        component: ProfileComponent,
        data: { titulo: 'Perfil' },
        canActivate: [AdminGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { titulo: 'Tablero' },
        canActivate: [AdminGuard]
    },
    {
        path: 'mensajes',
        component: MessagesComponent,
        data: { titulo: 'Mensajes' },
        canActivate: [AdminGuard]
    },
    {
        path: 'usuarios',
        component: UsersComponent,
        data: { titulo: 'Usuarios' },
        canActivate: [AdminGuard]
    },
    {
        path: 'posts',
        component: PostsComponent,
        data: { titulo: 'Articulos' },
        canActivate: [AdminGuard]
    },
    {
        path: 'casos',
        component: FilesComponent,
        data: { titulo: 'Casos' },
        canActivate: [AdminGuard]
    },
    {
        path: 'notificaciones',
        component: NotificationsComponent,
        data: { titulo: 'Notificaciones' },
        canActivate: [AdminGuard]
    },
    {
        path: '', redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];

export const ADMIN_ROUTING = RouterModule.forChild(ADMIN_ROUTES);