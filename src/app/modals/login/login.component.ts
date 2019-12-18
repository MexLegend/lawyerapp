import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../models/Usuario';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
    // if (form.invalid) {
    //   return;
    // }

    const user = new Usuario(
      null, null, form.value.email, null, null, form.value.password);

    // return console.log(user)

    this._usuariosS
      .login(user, form.value.remember)
      .subscribe(correct => {
        if (this._usuariosS.user.role === 'ADMIN') {
          this.router.navigate(['/admin'])
          if($(".sidenav-overlay").css("display", "block")){
            $(".sidenav-overlay").css("display", "none");
            // console.log(this);
          }
        } else if (this._usuariosS.user.role === 'USER') {
          this.router.navigate(['/inicio'])
        }
        this.password = '';
        $(document).ready(function () {
          $('#modalRegistro').modal('close');
        })
      });
  }

}
