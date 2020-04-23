import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfGeneralComponent } from './perfilPages/conf-general/conf-general.component';
import { SeguridadComponent } from './perfilPages/seguridad/seguridad.component';
import { InformacionComponent } from './perfilPages/informacion/informacion.component';
import { MensajesComponent } from './perfilPages/mensajes/mensajes.component';
import { ExpedientesComponent } from './perfilPages/expedientes/expedientes.component';
import { EventosComponent } from './perfilPages/eventos/eventos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ExpedienteDetalleComponent } from './perfilPages/expediente-detalle/expediente-detalle.component';
import { PipesModule } from '../../pipes/pipes.module';
import { MaterialModule } from '../../shared/material.module';
import { ModalsModule } from '../../modals/modals.module';


@NgModule({
  declarations: [
    ConfGeneralComponent,
    SeguridadComponent,
    InformacionComponent,
    MensajesComponent,
    ExpedientesComponent,
    EventosComponent,
    ExpedienteDetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    MaterialModule,
    ModalsModule,
    PipesModule,
    ReactiveFormsModule,
    [SweetAlert2Module.forRoot()]
  ]
})
export class PerfilModule { }
