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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { NotificacionesFormComponent } from './notificaciones/notificaciones-form/notificaciones-form.component';
import { ExpedientesFormComponent } from './expedientes/expedientes-form/expedientes-form.component';
import { SeguimientoExpedienteComponent } from './seguimiento-expediente/seguimiento-expediente.component';
import { ModalsModule } from '../modals/modals.module';

@NgModule({
  declarations: [ArticulosComponent, DashboardComponent, ArticulosFormComponent, UsuariosComponent, UsuariosFormComponent, ExpedientesComponent, NotificacionesComponent, NotificacionesFormComponent, ExpedientesFormComponent, SeguimientoExpedienteComponent],
  imports: [
    CommonModule,
    ADMIN_ROUTING,
    ReactiveFormsModule,
    SharedModule,
    AngularEditorModule,
    DataTablesModule,
    ModalsModule,
    [SweetAlert2Module.forRoot()]
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
