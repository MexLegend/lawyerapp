import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsuariosService } from './usuarios.service';
import { Files, FilesPaginacion } from '../models/Files';
import { NotificationService } from './notification.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class FilesService {

  public notifica = new EventEmitter<any>();

  constructor(
    private http?: HttpClient,
    private _usuariosS?: UsuariosService,
    public _notificationS?: NotificationService
  ) {

  }

  obtenerExpedientes(
    page: number = 0,
    perPage: number = 10,
    orderField: string = '',
    orderType: string = '',
    filter: string = '',
    filterOpt: string = 'affair',
    status: boolean = true
  ): Observable<FilesPaginacion> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    });

    let url = `${environment.URI}/api/file?status=${status}&page=${page +
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
      .get<FilesPaginacion>(url, { headers })
      .pipe(map((resp: any) => resp.files));
  }

  obtenerExpediente(id: string): Observable<Files> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    })
    const url = `${environment.URI}/api/file/${id}`;

    return this.http.get<Files>(url, { headers }).pipe(map((resp: any) => resp.file));
  }

  crearExpediente(file: Files): Observable<Files> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    });

    const url = `${environment.URI}/api/file`;

    return this.http.post<Files>(url, file, { headers }).pipe(
      map((resp: any) => {
        $("#modal-Expediente").modal("close");
        this._notificationS.mensaje('success', 'Creación correcta', resp.message, false, false, '', '', 2000);
        return resp;
      }),
      catchError(err => {
        $("#modal-Expediente").modal("close");
        this._notificationS.mensaje('error', 'Creación fallida', err.message, false, false, '', '', 2000);
        return throwError(err);
      })
    );
  }

  actualizarExpediente(id, file: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    })
    const url = `${environment.URI}/api/file/${id}`;

    return this.http.put(url, file, { headers }).pipe(map((resp: any) => {
      $("#modal-Expediente").modal("close");
      this._notificationS.mensaje('success', 'Actualización correcta', resp.mensaje, false, false, '', '', 2000);
      return true;
    }),
      catchError(err => {
        $("#modal-Expediente").modal("close");
        this._notificationS.mensaje('error', 'Actualización fallida', err.message, false, false, '', '', 2000);
        return throwError(err);
      })
    );
  }

  eliminarExpediente(id: string): Observable<Files> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    })
    const url = `${environment.URI}/api/file/${id}`;

    return this.http.delete<Files>(url, { headers }).pipe(map((resp: any) => {
      this._notificationS.mensaje('success', 'Eliminación correcta', resp.message, false, false, '', '', 2000);
      return resp;
    }));
  }
}
