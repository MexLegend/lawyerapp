import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../../models/User';
import { UsersService } from '../../../services/users.service';

declare var $: any;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private router: Router,
    private _usersS: UsersService
  ) { }

  email: string;
  password: string = '';
  remember = false;

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';

    if ( this.email.length > 1 ) {
      this.remember = true;
    }
  }

  logIn(form: NgForm) {

    const user = new User(
    form.value.email, null, null, form.value.password);

    this._usersS
      .login(user, form.value.remember)
      .subscribe(() => {
        if (this._usersS.user.role === 'ADMIN') {
          this.router.navigate(['/dashboard'])
          if ($(".sidenav-overlay").css("display", "block")) {
            $(".sidenav-overlay").css("display", "none");
          }
        } else if (this._usersS.user.role === 'USER') {
          this.router.navigate(['/perfil'])
        }
        this.password = '';
        $(document).ready(function () {
          $('#modalRegistro').modal('close');
        })
      });
  }
}