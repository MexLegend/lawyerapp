import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private _usuariosS: UsuariosService,
    private router: Router
  ) { }

  canActivate() {
    if (this._usuariosS.user.role === 'ADMIN') {
      return true;
    } else {
      this._usuariosS.logout();
      return false;
    }
  }

}
