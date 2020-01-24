import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { RegisterFormComponent } from './login/register-form/register-form.component';
import { SeleccionarUsuarioComponent } from './seleccionar-usuario/seleccionar-usuario.component';
import { SeleccionarExpedienteComponent } from './seleccionar-expediente/seleccionar-expediente.component';



@NgModule({
  declarations: [LoginComponent, LoginFormComponent, RegisterFormComponent, SeleccionarUsuarioComponent, SeleccionarExpedienteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ],
  exports: [
    LoginComponent,
    SeleccionarUsuarioComponent,
    SeleccionarExpedienteComponent
  ]
})
export class ModalsModule { }
