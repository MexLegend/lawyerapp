import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private _usuariosS: UsuariosService,
    private router: Router
  ) { }

  canActivate() {
    if (!this._usuariosS.estaLogueado()) {
      this.router.navigate(['/inicio']);
      return false;
    } else {
      return true;
    }
  }

}
