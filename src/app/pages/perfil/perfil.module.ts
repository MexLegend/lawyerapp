import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ConfGeneralComponent } from './perfilPages/conf-general/conf-general.component';
import { SeguridadComponent } from './perfilPages/seguridad/seguridad.component';
import { InformacionComponent } from './perfilPages/informacion/informacion.component';
import { MensajesComponent } from './perfilPages/mensajes/mensajes.component';
import { MisCasosComponent } from './perfilPages/mis-casos/mis-casos.component';
import { EventosComponent } from './perfilPages/eventos/eventos.component';
import { CasosDetalleComponent } from './perfilPages/casos-detalle/casos-detalle.component';
import { PipesModule } from '../../pipes/pipes.module';
import { ModalsModule } from '../../modals/modals.module';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [
    ConfGeneralComponent,
    SeguridadComponent,
    InformacionComponent,
    MensajesComponent,
    MisCasosComponent,
    EventosComponent,
    CasosDetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    MaterialModule,
    ModalsModule,
    NgxPaginationModule,
    PipesModule,
    ReactiveFormsModule,
    [SweetAlert2Module.forRoot()]
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilModule { }
