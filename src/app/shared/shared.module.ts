import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [NavbarComponent, NopagefoundComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    NopagefoundComponent
  ]
})
export class SharedModule { }
