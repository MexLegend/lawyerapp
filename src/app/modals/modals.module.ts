import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DataTablesModule } from 'angular-datatables';

import { FilesFormComponent } from './files-form/files-form.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { RegisterFormComponent } from './login/register-form/register-form.component';
import { NotificationsFormComponent } from './notifications-form/notifications-form.component';
import { PostsFormComponent } from './posts-form/posts-form.component';
import { SelectFileComponent } from './select-file/select-file.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { PipesModule } from '../pipes/pipes.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../shared/material.module';
import { FileUploadModule } from "ng2-file-upload";
import { LawyerContactComponent } from './lawyer-contact/lawyer-contact.component';
import { BePrimeComponent } from './be-prime/be-prime.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { DocumentsViewComponent } from './documents-view/documents-view.component';

@NgModule({
  declarations: [
    BePrimeComponent,
    DocumentsViewComponent,
    FileUploadComponent,
    FilesFormComponent,
    LawyerContactComponent,
    LoginComponent,
    LoginFormComponent,
    NotificationsFormComponent,
    PostsFormComponent,
    RegisterFormComponent,
    SelectFileComponent,
    SelectUserComponent,
    UsersFormComponent,
  ],
  entryComponents: [
    DocumentsViewComponent
  ],
  exports: [
    BePrimeComponent,
    DocumentsViewComponent,
    FileUploadComponent,
    FilesFormComponent,
    LawyerContactComponent,
    LoginComponent,
    NotificationsFormComponent,
    PostsFormComponent,
    SelectFileComponent,
    SelectUserComponent,
    UsersFormComponent,
  ],
  imports: [
    AngularEditorModule,
    CommonModule,
    ComponentsModule,
    DataTablesModule,
    FileUploadModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule
  ]
})
export class ModalsModule { }
