import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ContactoComponent } from './contacto/contacto.component';
import { PAGES_ROUTING } from './pages.routes';
import { NoticiasComponent } from './noticias/noticias.component';
import { InicioComponent } from './inicio/inicio.component';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: [ContactoComponent, NoticiasComponent, InicioComponent, DashboardComponent],
  imports: [
    CommonModule,
    PAGES_ROUTING
  ]
})
export class PagesModule { }
