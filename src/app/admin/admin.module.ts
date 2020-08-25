import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { AutosizeModule } from 'ngx-autosize';

import { ADMIN_ROUTING } from './admin.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComponentsModule } from '../components/components.module';
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
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    DashboardComponent,
    FilesComponent,
    FileTrackingComponent,
    MessagesComponent,
    NotificationsComponent,
    PostsComponent,
    UsersComponent,
    ProfileComponent
  ],
  imports: [
    ADMIN_ROUTING,
    CommonModule,
    ComponentsModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    [SweetAlert2Module.forRoot()],
    MaterialModule,
    ModalsModule,
    NgxPaginationModule,
    PipesModule,
    SharedModule,
    AutosizeModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
