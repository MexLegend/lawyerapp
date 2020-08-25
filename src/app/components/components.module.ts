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
    FormsModule,
    MaterialModule,
    NgxPaginationModule,
    PipesModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
