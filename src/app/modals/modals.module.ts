import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DataTablesModule } from 'angular-datatables';
import { FileUploadModule } from "ng2-file-upload";

import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../shared/material.module';
import { PipesModule } from '../pipes/pipes.module';

import { ChatComponent } from './chat/chat.component';
import { BePrimeComponent } from './be-prime/be-prime.component';
import { DocumentsViewComponent } from './documents-view/documents-view.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FilesFormComponent } from './files-form/files-form.component';
import { FiltersComponent } from './filters/filters.component';
import { LawyerContactComponent } from './lawyer-contact/lawyer-contact.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { RegisterFormComponent } from './login/register-form/register-form.component';
import { NotificationsFormComponent } from './notifications-form/notifications-form.component';
import { PostsFormComponent } from './posts-form/posts-form.component';
import { SelectFileComponent } from './select-file/select-file.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { SelectEvidenceComponent } from './select-evidence/select-evidence.component';
import { SelectNotesComponent } from './select-notes/select-notes.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { WriteNoteComponent } from './write-note/write-note.component';

import {
  PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { ReplyComponent } from './reply/reply.component';
import { FilePreviewComponent } from './file-preview/file-preview.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  useBothWheelAxes: false,
  suppressScrollX: true
};

import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  declarations: [
    BePrimeComponent,
    DocumentsViewComponent,
    FileUploadComponent,
    FilesFormComponent,
    FiltersComponent,
    LawyerContactComponent,
    LoginComponent,
    LoginFormComponent,
    NotificationsFormComponent,
    PostsFormComponent,
    RegisterFormComponent,
    ReplyComponent,
    SelectFileComponent,
    SelectUserComponent,
    UsersFormComponent,
    ChatComponent,
    SelectEvidenceComponent,
    SelectNotesComponent,
    WriteNoteComponent,
    FilePreviewComponent,
  ],
  entryComponents: [
    BePrimeComponent,
    ChatComponent,
    DocumentsViewComponent,
    FilesFormComponent,
    FiltersComponent,
    FileUploadComponent,
    LawyerContactComponent,
    PostsFormComponent,
    ReplyComponent,
    SelectEvidenceComponent,
    SelectNotesComponent,
    UsersFormComponent,
    WriteNoteComponent,
  ],
  exports: [
    BePrimeComponent,
    DocumentsViewComponent,
    FileUploadComponent,
    FilesFormComponent,
    FiltersComponent,
    LawyerContactComponent,
    LoginComponent,
    NotificationsFormComponent,
    PostsFormComponent,
    ReplyComponent,
    SelectFileComponent,
    SelectUserComponent,
    UsersFormComponent,
    ChatComponent,
    SelectEvidenceComponent,
    SelectNotesComponent,
    WriteNoteComponent,
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
    PerfectScrollbarModule,
    NgxDocViewerModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalsModule {}
