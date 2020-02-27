import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Articulo, ArticulosPaginacion } from '../models/Articulo';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsuariosService } from './usuarios.service';
import { NotificationService } from './notification.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  public notifica = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private _usuariosS: UsuariosService,
    public _notificationS: NotificationService
  ) { }

  obtenerArticulos(
    page: number = 0,
    perPage: number = 10,
    orderField: string = '',
    orderType: string = '',
    filter: string = '',
    filterOpt: string = 'title',
    status: boolean = true
  ): Observable<ArticulosPaginacion> {

    let url = `${environment.URI}/api/articulos?status=${status}&page=${page +
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
      .get<ArticulosPaginacion>(url)
      .pipe(map((resp: any) => resp.posts));
  }

  obtenerArticulo(id: string): Observable<Articulo> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    })
    const url = `${environment.URI}/api/articulos/${id}`;

    return this.http.get<Articulo>(url, { headers }).pipe(map((resp: any) => resp.post));
  }

  crearArticulo(articulo: Articulo): Observable<Articulo> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    });

    const url = `${environment.URI}/api/articulos`;

    return this.http.post<Articulo>(url, articulo, { headers }).pipe(
      map((resp: any) => {
        $("#modal-Articulo").modal("close");
        this._notificationS.mensaje('success', 'Creación correcta', resp.message, false, false, '', '', 2000);
        return resp;
      }),
      catchError(err => {
        $("#modal-Articulo").modal("close");
        this._notificationS.mensaje('error', 'Creación fallida', err.message, false, false, '', '', 2000);
        return throwError(err);
      })
    );
  }

  actualizarArticulo(id, post: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    })
    const url = `${environment.URI}/api/articulos/${id}`;

    return this.http.put(url, post, { headers }).pipe(map((resp: any) => {
      $("#modal-Articulo").modal("close");
      this._notificationS.mensaje('success', 'Actualización correcta', resp.mensaje, false, false, '', '', 2000);
      return true;
    }),
      catchError(err => {
        $("#modal-Articulo").modal("close");
        this._notificationS.mensaje('error', 'Actualización fallida', err.message, false, false, '', '', 2000);
        return throwError(err);
      })
    );
  }

  eliminarArticulo(id: string): Observable<Articulo> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    })
    const url = `${environment.URI}/api/articulos/${id}`;

    return this.http.delete<Articulo>(url, { headers }).pipe(map((resp: any) => {
      this._notificationS.mensaje('success', 'Eliminación correcta', resp.message, false, false, '', '', 2000);
      return resp;
    }));
  }

}
