import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NgxPaginationModule } from "ngx-pagination";
import { AutosizeModule } from "ngx-autosize";
import { FileUploadModule } from "ng2-file-upload";

import { ADMIN_ROUTING } from "./admin.routes";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ComponentsModule } from "../components/components.module";
import { FilesComponent } from "./files/files.component";
import { MessagesComponent } from "./messages/messages.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { PipesModule } from "../pipes/pipes.module";
import { PostsComponent } from "./posts/posts.component";
import { ProfileComponent } from "./profile/profile.component";
import { MaterialModule } from "../shared/material.module";
import { SharedModule } from "../shared/shared.module";
import { UsersComponent } from "./users/users.component";
import { PracticeAreasComponent } from './practice-areas/practice-areas.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FilesComponent,
    MessagesComponent,
    NotificationsComponent,
    PostsComponent,
    UsersComponent,
    ProfileComponent,
    PracticeAreasComponent,
  ],
  imports: [
    ADMIN_ROUTING,
    AutosizeModule,
    CommonModule,
    ComponentsModule,
    DataTablesModule,
    FileUploadModule,
    FormsModule,
    MaterialModule,
    NgxPaginationModule,
    PipesModule,
    ReactiveFormsModule,
    SharedModule,
    [SweetAlert2Module.forRoot()],
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
