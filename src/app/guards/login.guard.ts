import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private _usersS: UsersService
  ) { }

  canActivate() {
    if (!this._usersS.isLogged()) {
      this.router.navigate(['/inicio']);
      return false;
    } else {
      return true;
    }
  }

}
