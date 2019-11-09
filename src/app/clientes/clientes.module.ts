import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CLIENTE_ROUTING } from './clientes.routing';

import { ContactoComponent } from '../pages/contacto/contacto.component';
import { NoticiasComponent } from '../pages/noticias/noticias.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ContactoComponent,
    NoticiasComponent,
    InicioComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CLIENTE_ROUTING,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ClientesModule { }
