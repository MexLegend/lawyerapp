import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from './progress/progress.component';
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EvidencesComponent } from './evidences/evidences.component';
import { MaterialModule } from '../shared/material.module';
import { NotesComponent } from './notes/notes.component';
import { ChatSidenavComponent } from './chat/chat-sidenav.component';
import { PipesModule } from '../pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FilePreviewComponent } from '../modals/file-preview/file-preview.component';
import { NotificationsDropdownComponent } from './notifications-dropdown/notifications-dropdown.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProgressComponent,
    ThemeSwitchComponent,
    EvidencesComponent,
    NotesComponent,
    ChatSidenavComponent,
    NotificationsDropdownComponent
  ],
  entryComponents: [
    FilePreviewComponent
  ],
  exports: [
    ProgressComponent,
    ThemeSwitchComponent,
    EvidencesComponent,
    NotesComponent,
    ChatSidenavComponent,
    NotificationsDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgxPaginationModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: [] }],
})
export class ComponentsModule {}
