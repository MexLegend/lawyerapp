import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../../models/Usuario';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
declare var $: any;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  email: string;
  password: string = '';
  remember = false;

  constructor(
    private _usuariosS: UsuariosService,
    private router: Router
  ) { }

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';

    if (this.email.length > 1) {
      this.remember = true;
    }
  }

  logIn(form: NgForm) {

    const user = new Usuario(
      form.value.email, null, null, form.value.password, null, null);

    // console.log(user);

    this._usuariosS
      .login(user, form.value.remember)
      .subscribe(correct => {
        if (this._usuariosS.user.role === 'ADMIN') {
          this.router.navigate(['/dashboard'])
          if ($(".sidenav-overlay").css("display", "block")) {
            $(".sidenav-overlay").css("display", "none");
          }
        } else if (this._usuariosS.user.role === 'USER') {
          this.router.navigate(['/perfil'])
        }
        this.password = '';
        $(document).ready(function () {
          $('#modalRegistro').modal('close');
        })
      });
  }

}
