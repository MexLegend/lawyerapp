import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from './progress/progress.component';
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EvidencesComponent } from './evidences/evidences.component';
import { MaterialModule } from '../shared/material.module';
import { NotesComponent } from './notes/notes.component';
import { ChatSidenavComponent } from './chat/chat-sidenav.component';

@NgModule({
  declarations: [
    ProgressComponent,
    ThemeSwitchComponent,
    EvidencesComponent,
    NotesComponent,
    ChatSidenavComponent
  ],
  exports: [
    ProgressComponent,
    ThemeSwitchComponent,
    EvidencesComponent,
    NotesComponent,
    ChatSidenavComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
})
export class ComponentsModule { }
