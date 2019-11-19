import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { ArticulosFormComponent } from './articulos/articulos-form.component';
import { ADMIN_ROUTING } from './admin.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import {
  PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { AngularEditorModule } from '@kolkov/angular-editor';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};


@NgModule({
  declarations: [ArticulosComponent, DashboardComponent, ArticulosFormComponent],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    ADMIN_ROUTING,
    ReactiveFormsModule,
    SharedModule,
    AngularEditorModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
