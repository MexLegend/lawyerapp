import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../models/Usuario';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  remember = false;

  constructor(
    private _usuariosS: UsuariosService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this._usuariosS.token) {
      this.router.navigate(['/admin']);
    }

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
      null, form.value.email, null, null, form.value.password);

    this._usuariosS
      .login(user, form.value.remember)
      .subscribe(correct => this.router.navigate(['/admin']));
  }

}
