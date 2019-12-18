import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ModalsModule } from '../modals/modals.module';
import { MatMenuModule, MatButtonModule, MatExpansionModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule, MatListModule } from '@angular/material'


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    FooterComponent,
    NavbarComponent,
    NopagefoundComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalsModule,
    MatMenuModule, MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule, MatListModule,
    MatExpansionModule,
  ],
  exports: [
    BreadcrumbsComponent,
    FooterComponent,
    NavbarComponent,
    NopagefoundComponent
  ]
})
export class SharedModule { }
