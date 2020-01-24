import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ModalsModule } from '../modals/modals.module';
import { MatMenuModule, MatButtonModule, MatExpansionModule, MatSnackBarModule, MatSelectModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule, MatListModule } from '@angular/material';
import { UsuariosFilterComponent } from './usuarios-filter/usuarios-filter.component';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    FooterComponent,
    NavbarComponent,
    NopagefoundComponent,
    UsuariosFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalsModule,
    MatMenuModule, MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule, MatListModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  exports: [
    BreadcrumbsComponent,
    FooterComponent,
    NavbarComponent,
    NopagefoundComponent,
    UsuariosFilterComponent,
    MatSelectModule
  ]
})
export class SharedModule { }
