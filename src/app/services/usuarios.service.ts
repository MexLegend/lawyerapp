import { Injectable } from '@angular/core';
import { Usuario, UsuariosPaginacion } from '../models/Usuario';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from './notification.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  token: string;
  user: Usuario;
  id: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    public _notificationS: NotificationService,
  )
  // public _subirIS: SubirImagenService
  {
    this.cargarStorage();
  }

  eliminarUsuario(id: string): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });
    const url = `${environment.URI}/api/usuarios/${id}`;

    return this.http.delete<Usuario>(url, { headers });
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  obtenerUsuario(id: string): Observable<Usuario> {
    if (id === this.user._id) {
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });
    const url = `${environment.URI}/api/usuarios/${id}`;

    return this.http
      .get<Usuario>(url, { headers })
      .pipe(map((resp: any) => resp.users));
  }

  obtenerUsuarios(
    page: number = 0,
    perPage: number = 10,
    orderField: string = '',
    orderType: string = '',
    filter: string = '',
    filterOpt: string = 'firstName',
    status: boolean = true
  ): Observable<UsuariosPaginacion> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });

    let url = `${environment.URI}/api/usuarios?status=${status}&page=${page +
      1}&perPage=${perPage}`;

    if (orderField && orderType) {
      url = `${url}&orderField=${orderField}&orderType=${orderType}`;
    }

    if (filterOpt) {
      url = `${url}&filterOpt=${filterOpt}`;
    }

    if (filter) {
      url = `${url}&filter=${filter}`;
    }

    return this.http
      .get<UsuariosPaginacion>(url, { headers })
      .pipe(map((resp: any) => resp.users));
  }

  estaLogueado() {
    if (this.token === undefined || this.token === null) {
      return;
    } else {
      return this.token.length > 5 ? true : false;
    }
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.id = localStorage.getItem('id');
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
    } else {
      this.id = '';
      this.token = '';
      this.user = null;
    }
  }

  login(user: Usuario, remember: boolean = false) {
    if (remember) {
      localStorage.setItem('email', user.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = `${environment.URI}/api/login`;
    return this.http.post(url, user).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.user._id, resp.token, resp.user);
        return true;
      }),
      catchError(err => {
        this._notificationS.mensaje('error', 'Credenciales incorrectas', err.error.message, true, false, '', 'Cerrar', 4000)
        return throwError(err);
      })
    );
  }

  logout() {
    this.user = null;
    this.id = null;
    this.token = null;

    localStorage.removeItem('user');
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    if ($(".sidenav-overlay").css("display", "block")) {
      $(".sidenav-overlay").css("display", "none");
    }
    this.router.navigate(['/inicio']);
  }

  crearUsuario(user: Usuario) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });
    const url = `${environment.URI}/api/usuarios`;

    return this.http.post(url, user, { headers }).pipe(
      map((resp: any) => {
        $("#modalUsuarios").modal("close");
        this._notificationS.mensaje('success', 'Creación correcta', resp.message, false, false, '', '', 2000)

        return resp.users;
      }),
      catchError(err => {
        $("#modalUsuarios").modal("close");
        this._notificationS.mensaje('error', 'Creación fallida', err.error.message, false, false, '', '', 2000)
        return throwError(err);
      })
    );
  }

  actualizarPassword(id, user: any) {
    const url = `${environment.URI}/api/usuarios/cambiar-pass/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });

    return this.http.put(url, user, { headers }).pipe(
      map((resp: any) => {
        this._notificationS.mensaje('error', 'Actualización fallida', resp.message, false, false, '', '', 2000)
        if(resp.ok) {
          if (id === this.id) {
            this.guardarStorage(resp.user._id, this.token, resp.user);
          }
          this._notificationS.mensaje('success', 'Actualización correcta', resp.message, false, false, '', '', 2000)
          return true;
        }
      }),
      catchError(err => {
        this._notificationS.mensaje('error', 'Actualización fallida', err.message, false, false, '', '', 2000)
        return throwError(err);
      })
    );
  }

  actualizarUsuario(id, user: any) {
    const url = `${environment.URI}/api/usuarios/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });

    return this.http.put(url, user, { headers }).pipe(
      map((resp: any) => {
        if (id === this.id) {
          this.guardarStorage(resp.user._id, this.token, resp.user);
        }
        this._notificationS.mensaje('success', 'Actualización correcta', resp.message, false, false, '', '', 2000)
        return true;
      })
    );
  }

  guardarStorage(id: string, token: string, user: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.id = id;
    this.user = user;
    this.token = token;
  }
}
