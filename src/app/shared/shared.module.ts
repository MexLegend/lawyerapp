import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from './material.module';
import { ModalsModule } from '../modals/modals.module';
import { PipesModule } from '../pipes/pipes.module';
import { UsersFilterComponent } from './users-filter/users-filter.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    FooterComponent,
    NavbarComponent,
    NopagefoundComponent,
    UsersFilterComponent
  ],
  exports: [
    BreadcrumbsComponent,
    FooterComponent,
    MaterialModule,
    NavbarComponent,
    NopagefoundComponent,
    UsersFilterComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    MaterialModule,
    ModalsModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule
  ]  
})
export class SharedModule { }
