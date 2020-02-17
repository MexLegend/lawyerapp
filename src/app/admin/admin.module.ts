import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { ADMIN_ROUTING } from './admin.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { SeguimientoExpedienteComponent } from './seguimiento-expediente/seguimiento-expediente.component';
import { ModalsModule } from '../modals/modals.module';
import { MensajesComponent } from './mensajes/mensajes.component';

@NgModule({
  declarations: [ArticulosComponent, DashboardComponent, UsuariosComponent, ExpedientesComponent, NotificacionesComponent, SeguimientoExpedienteComponent, MensajesComponent],
  imports: [
    CommonModule,
    ADMIN_ROUTING,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule,
    ModalsModule,
    [SweetAlert2Module.forRoot()]
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdminModule { }
