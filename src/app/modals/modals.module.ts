import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { DataTablesModule } from "angular-datatables";
import { FileUploadModule } from "ng2-file-upload";

import { ComponentsModule } from "../components/components.module";
import { MaterialModule } from "../shared/material.module";
import { PipesModule } from "../pipes/pipes.module";

import { ChatComponent } from "./chat/chat.component";
import { BePrimeComponent } from "./be-prime/be-prime.component";
import { DocumentsViewComponent } from "./documents-view/documents-view.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { FilesFormComponent } from "./files-form/files-form.component";
import { FiltersComponent } from "./filters/filters.component";
import { LawyerContactComponent } from "./lawyer-contact/lawyer-contact.component";
import { LoginComponent } from "./login/login.component";
import { LoginFormComponent } from "./login/login-form/login-form.component";
import { RateComponent } from './rate/rate.component';
import { ReferencesComponent } from "./references/references.component";
import { RegisterFormComponent } from "./login/register-form/register-form.component";
import { RouterModule } from '@angular/router';
import { NotificationsFormComponent } from "./notifications-form/notifications-form.component";
import { PostsFormComponent } from "./posts-form/posts-form.component";
import { SelectFileComponent } from "./select-file/select-file.component";
import { SelectUserComponent } from "./select-user/select-user.component";
import { SelectEvidenceComponent } from "./select-evidence/select-evidence.component";
import { SelectNotesComponent } from "./select-notes/select-notes.component";
import { UsersFormComponent } from "./users-form/users-form.component";
import { WriteNoteComponent } from "./write-note/write-note.component";

import { ReplyComponent } from "./reply/reply.component";
import { FilePreviewComponent } from "./file-preview/file-preview.component";

import { FAQComponent } from "./faq/faq.component";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { PracticeAreasFormComponent } from "./practice-areas-form/practice-areas-form.component";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

@NgModule({
  declarations: [
    BePrimeComponent,
    ChatComponent,
    DocumentsViewComponent,
    FAQComponent,
    FileUploadComponent,
    FilesFormComponent,
    FilePreviewComponent,
    FiltersComponent,
    LawyerContactComponent,
    LoginComponent,
    LoginFormComponent,
    NotificationsFormComponent,
    PostsFormComponent,
    PracticeAreasFormComponent,
    RateComponent,
    ReferencesComponent,
    RegisterFormComponent,
    ReplyComponent,
    SelectFileComponent,
    SelectUserComponent,
    SelectEvidenceComponent,
    SelectNotesComponent,
    UsersFormComponent,
    WriteNoteComponent,
  ],
  entryComponents: [
    BePrimeComponent,
    ChatComponent,
    DocumentsViewComponent,
    FAQComponent,
    FilesFormComponent,
    FiltersComponent,
    FileUploadComponent,
    LawyerContactComponent,
    LoginComponent,
    PostsFormComponent,
    PracticeAreasFormComponent,
    RateComponent,
    ReferencesComponent,
    ReplyComponent,
    SelectEvidenceComponent,
    SelectNotesComponent,
    UsersFormComponent,
    WriteNoteComponent,
  ],
  exports: [
    BePrimeComponent,
    ChatComponent,
    DocumentsViewComponent,
    FAQComponent,
    FileUploadComponent,
    FilesFormComponent,
    FiltersComponent,
    LawyerContactComponent,
    LoginComponent,
    NotificationsFormComponent,
    PostsFormComponent,
    PracticeAreasFormComponent,
    RateComponent,
    ReferencesComponent,
    ReplyComponent,
    SelectFileComponent,
    SelectUserComponent,
    SelectEvidenceComponent,
    SelectNotesComponent,
    UsersFormComponent,
    WriteNoteComponent,
  ],
  imports: [
    AngularEditorModule,
    CKEditorModule,
    CommonModule,
    ComponentsModule,
    DataTablesModule,
    FileUploadModule,
    FormsModule,
    MaterialModule,
    NgxDocViewerModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalsModule {}
