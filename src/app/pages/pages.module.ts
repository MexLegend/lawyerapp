import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ContactoComponent } from './contacto/contacto.component';
import { PAGES_ROUTING } from './pages.routes';
import { NoticiasComponent } from './noticias/noticias.component';
import { InicioComponent } from './inicio/inicio.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ContactoComponent, NoticiasComponent, InicioComponent, DashboardComponent],
  imports: [
    CommonModule,
    PAGES_ROUTING,
    SharedModule
  ]
})
export class PagesModule { }
