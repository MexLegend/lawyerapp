import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { RegisterFormComponent } from './login/register-form/register-form.component';
import { SeleccionarUsuarioComponent } from './seleccionar-usuario/seleccionar-usuario.component';
import { SeleccionarExpedienteComponent } from './seleccionar-expediente/seleccionar-expediente.component';
import { ExpedientesFormComponent } from './expedientes-form/expedientes-form.component';
import { NotificacionesFormComponent } from './notificaciones-form/notificaciones-form.component';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { ArticulosFormComponent } from './articulos-form/articulos-form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [LoginComponent, LoginFormComponent, RegisterFormComponent, SeleccionarUsuarioComponent, SeleccionarExpedienteComponent, ExpedientesFormComponent, NotificacionesFormComponent, UsuariosFormComponent, ArticulosFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    AngularEditorModule,
  ],
  exports: [
    LoginComponent,
    SeleccionarUsuarioComponent,
    SeleccionarExpedienteComponent,
    ExpedientesFormComponent,
    NotificacionesFormComponent,
    UsuariosFormComponent,
    ArticulosFormComponent
  ]
})
export class ModalsModule { }
