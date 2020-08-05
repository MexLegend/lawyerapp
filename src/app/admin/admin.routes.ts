import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FilesComponent } from './files/files.component';
import { FileTrackingComponent } from './file-tracking/file-tracking.component';
import { AdminGuard } from '../guards/admin.guard';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostsComponent } from './posts/posts.component';
import { UsersComponent } from './users/users.component';

const ADMIN_ROUTES: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' },
        canActivate: [AdminGuard]
    },
    {
        path: 'mensajes',
        component: MessagesComponent,
        data: { titulo: 'Mensajes' },
    },
    {
        path: 'usuarios',
        component: UsersComponent,
        data: { titulo: 'Usuarios' }
    },
    {
        path: 'posts',
        component: PostsComponent,
        data: { titulo: 'Articulos' }
    },
    {
        path: 'casos',
        component: FilesComponent,
        data: { titulo: 'Casos' }
    },
    {
        path: 'seguimiento-caso',
        component: FileTrackingComponent,
        data: { titulo: 'Seguimiento Caso' }
    },
    {
        path: 'notificaciones',
        component: NotificationsComponent,
        data: { titulo: 'Notificaciones' }
    },
    {
        path: '', redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];

export const ADMIN_ROUTING = RouterModule.forChild(ADMIN_ROUTES);