import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CLIENTE_ROUTING } from './clientes.routing';

import { PerfilComponent } from '../pages/perfil/perfil.component';
import { ContactoComponent } from '../pages/contacto/contacto.component';
import { NoticiasComponent } from '../pages/noticias/noticias.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PerfilModule } from '../pages/perfil/perfil.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PagesComponent } from '../pages/pages.component';
import { NoticiaDetalleComponent } from '../pages/noticia-detalle/noticia-detalle.component';

@NgModule({
  declarations: [
    PerfilComponent,
    ContactoComponent,
    NoticiasComponent,
    NoticiaDetalleComponent,
    InicioComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    CLIENTE_ROUTING,
    DataTablesModule,
    FormsModule,
    MatFormFieldModule,
    NgxPaginationModule,
    PerfilModule,
    ReactiveFormsModule,
    SharedModule,
    [SweetAlert2Module.forRoot()]
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientesModule { }
