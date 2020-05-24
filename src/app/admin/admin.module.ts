import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ADMIN_ROUTING } from './admin.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilesComponent } from './files/files.component';
import { FileTrackingComponent } from './file-tracking/file-tracking.component';
import { MessagesComponent } from './messages/messages.component';
import { ModalsModule } from '../modals/modals.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { PipesModule } from '../pipes/pipes.module';
import { PostsComponent } from './posts/posts.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './users/users.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    DashboardComponent,
    FilesComponent,
    FileTrackingComponent,
    MessagesComponent,
    NotificationsComponent,
    PostsComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    [SweetAlert2Module.forRoot()],
    ReactiveFormsModule,
    ADMIN_ROUTING,
    MaterialModule,
    ModalsModule,
    PipesModule,
    SharedModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
