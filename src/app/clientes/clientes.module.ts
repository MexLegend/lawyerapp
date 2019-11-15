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
import {
  PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  declarations: [
    PerfilComponent,
    ContactoComponent,
    NoticiasComponent,
    InicioComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CLIENTE_ROUTING,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    MatFormFieldModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientesModule { }
