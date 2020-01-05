import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfGeneralComponent } from './perfilPages/conf-general/conf-general.component';
import { CambiarPassComponent } from './perfilPages/cambiar-pass/cambiar-pass.component';
import { InformacionComponent } from './perfilPages/informacion/informacion.component';
import { SocialComponent } from './perfilPages/social/social.component';
import { ExpedientesComponent } from './perfilPages/expedientes/expedientes.component';
import { EventosComponent } from './perfilPages/eventos/eventos.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ExpedienteDetalleComponent } from './perfilPages/expediente-detalle/expediente-detalle.component';


@NgModule({
  declarations: [ConfGeneralComponent, CambiarPassComponent, InformacionComponent, SocialComponent, ExpedientesComponent, EventosComponent, ExpedienteDetalleComponent],
  imports: [
    CommonModule,
    FormsModule,
    [SweetAlert2Module.forRoot()]
  ]
})
export class PerfilModule { }
