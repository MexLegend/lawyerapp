import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { ArticulosFormComponent } from './articulos/articulos-form.component';
import { ADMIN_ROUTING } from './admin.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DataTablesModule } from 'angular-datatables';
import { UsuariosFormComponent } from './usuarios/usuarios-form/usuarios-form.component';



@NgModule({
  declarations: [ArticulosComponent, DashboardComponent, ArticulosFormComponent, UsuariosComponent, UsuariosFormComponent],
  imports: [
    CommonModule,
    ADMIN_ROUTING,
    ReactiveFormsModule,
    SharedModule,
    AngularEditorModule,
    DataTablesModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
