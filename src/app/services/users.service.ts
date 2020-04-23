import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { NotificationsPagination } from '../models/Notification';
import { User, UsersPagination } from '../models/User';
import { NotificationsService } from './notifications.service';
import { WebSocketService } from './webSocket.service';
import { ThemeService, lightTheme } from './theme.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  id: string;
  public notifica = new EventEmitter<any>();
  notifications: NotificationsPagination;
  user: User;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    public _notificationsS: NotificationsService,
    public _themeS: ThemeService,
    public _webS: WebSocketService
  )
  // public _subirIS: SubirImagenService
  {
    this.loadStorage();
  }

  checkEmail(email: string) {
    const url = `${ environment.URI }/api/users/check/email`;
    const body = {
      email
    }

    return this.http.post(url, body).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  createUser(user: User, img?: any) {

    const url = `${ environment.URI }/api/users`;

    this._webS.emitEvt('exist-user', user);

    const data = {
      user,
      img
    }

    return this.http.post(url, data).pipe(
      map((resp: any) => {
        $("#modalUsers").modal("close");
        this._notificationsS.message('success', 'Creación correcta', resp.message, false, false, '', '', 2000)

        return resp.users;
      }),
      catchError(err => {
        $("#modalUsers").modal("close");
        this._notificationsS.message('error', 'Creación fallida', err.error.message, false, false, '', '', 2000)
        return throwError(err);
      })
    );
  }

  deleteUser(id: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });
    const url = `${ environment.URI }/api/users/${ id }`;

    return this.http.delete<User>(url, { headers }).pipe(map((resp: any) => {
      this._notificationsS.message('success', 'Eliminación correcta', resp.message, false, false, '', '', 2000);
      return resp;
    })
    );
  }

  isLogged() {
    if (this.token === undefined || this.token === null) {
      return;
    } else {
      return this.token.length > 5 ? true : false;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(id: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });
    const url = `${ environment.URI }/api/users/${ id }`;

    return this.http.get<User>(url, { headers }).pipe(map((resp: any) => resp.user));
  }

  getUsers(
    page: number = 0,
    perPage: number = 10,
    orderField: string = '',
    orderType: string = '',
    filter: string = '',
    filterOpt: string = 'firstName',
    status: boolean = true
  ): Observable<UsersPagination> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });

    let url = `${ environment.URI }/api/users?status=${ status }&page=${ page  +
      1}&perPage=${ perPage }`;

    if ( orderField && orderType ) {
      url = `${ url }&orderField=${ orderField }&orderType=${ orderType }`;
    }

    if ( filterOpt ) {
      url = `${ url }&filterOpt=${ filterOpt }`;
    }

    if ( filter ) {
      url = `${ url }&filter=${ filter }`;
    }

    return this.http
      .get<UsersPagination>(url, { headers })
      .pipe(map((resp: any) => resp.users));
  }

  loadStorage() {
    if ( localStorage.getItem('token') ) {
      this.id = localStorage.getItem('id');
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
      this._themeS.setTheme(JSON.parse(localStorage.getItem("theme")))
    } else {
      this.id = '';
      this.token = '';
      this.user = null;
      this.notifications = null;
      localStorage.removeItem('notifications');
    }
  }

  login(user: User, remember: boolean = false) {
    if ( remember ) {
      localStorage.setItem('email', user.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = `${ environment.URI }/api/login`;

    return this.http.post(url, user).pipe(
      map((resp: any) => {
        
        if ( localStorage.getItem("theme") ) {
          this._themeS.setTheme(JSON.parse(localStorage.getItem("theme")))
        } else {
          localStorage.setItem("theme", JSON.stringify(lightTheme))
          localStorage.setItem("dark", "false")
        }
        this.saveStorage(resp.user._id, resp.token, resp.user);
        return true;
      }),
      catchError(err => {
        this._notificationsS.message('error', 'Credenciales incorrectas', err.error.message, true, false, '', 'Cerrar', 4000)
        return throwError(err);
      })
    );
  }

  logout() {
    this.user = null;
    this.id = null;
    this.token = null;

    localStorage.removeItem("notifications");
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    localStorage.removeItem('token');

    if ( $(".sidenav-overlay").css("display", "block") ) {
      $(".sidenav-overlay").css("display", "none");
    }

    this.router.navigate(['/inicio']);
  }

  saveStorage(id: string, token: string, user: User) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.id = id;
    this.user = user;
    this.token = token;
  }

  updatePassword(id, user: any) {
    
    const url = `${ environment.URI }/api/users/change-pass/${ id }`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.token
    });

    return this.http.put(url, user, { headers }).pipe(
      map((resp: any) => {
        if ( resp.ok ) {
          if ( id === this.id ) {
            this.saveStorage(resp.user._id, this.token, resp.user);
          }

          this._notificationsS.message('success', 'Actualización correcta', resp.message, false, false, '', '', 2000);
        } else {
          this._notificationsS.message('error', 'Actualización fallida', resp.message, false, false, '', '', 2000)
        }

        return resp;
      }),
      catchError(err => {
        this._notificationsS.message('error', 'Actualización fallida', err.message, false, false, '', '', 2000)
        return throwError(err);
      })
    );
  }

  updateUser(id, user: any, img?: any) {
    const url = `${ environment.URI }/api/users/${ id }`;
    const headers = new HttpHeaders({
      token: this.token
    });

    const data = {
      user,
      img,
    };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        if ( id === this.id ) {
          this.saveStorage(resp.user._id, this.token, resp.user);
        }

        $("#modalUsers").modal("close");
        
        this._notificationsS.message('success', 'Actualización correcta', resp.message, false, false, '', '', 2000)
        
        return true;
      }),
      catchError(err => {
        $("#modalUsers").modal("close");
        
        this._notificationsS.message('error', 'Actualización fallida', err.message, false, false, '', '', 2000);
        
        return throwError(err);
      })
    );
  }
}