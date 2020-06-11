import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
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
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio'; 
import { DocumentsViewComponent } from './documents-view/documents-view.component';
import {
  PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  useBothWheelAxes: false,
  suppressScrollX: true
};

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
    BePrimeComponent,
    DocumentsViewComponent,
    FilesFormComponent
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
    MatDialogModule,
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
    MatIconModule,
    PerfectScrollbarModule,
    MatRadioModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
})
export class ModalsModule { }
