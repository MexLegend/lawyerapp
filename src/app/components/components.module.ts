import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from './progress/progress.component';
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProgressComponent,
    ThemeSwitchComponent
  ],
  exports: [
    ProgressComponent,
    ThemeSwitchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
