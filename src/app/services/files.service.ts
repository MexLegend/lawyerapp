import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuariosService } from './usuarios.service';
import { Files, FilesPaginacion } from '../models/Files';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private http: HttpClient,
    private _usuariosS: UsuariosService
  ) { }

  actualizarExpediente(id, file: any) {
    const url = `${environment.URI}/api/file/${id}`;

    return this.http.put(url, file).pipe(
      map((resp: any) => {
    //    this._notificationS.mensaje('success', 'Actualización correcta', resp.message, false, false, '', '', 2000)
        return true;
      })
    );
  }

  crearExpediente(file: Files): Observable<Files> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    });


    const url = `${environment.URI}/api/file`;

    return this.http.post<Files>(url, file, { headers }).pipe(
      map((resp: any) => {
        // this._notificacionS.crear(`Carrera ${resp.carrera.nombre} actualizado`, 'Cerrar', 3000);
        console.log(resp);
        return resp;
      })
    );
  }

  eliminarExpediente(id: string): Observable<Files> {

    const url = `${environment.URI}/api/file/${id}`;

    return this.http.delete<Files>(url);
  }

  obtenerExpediente(id: string): Observable<Files> {
    const url = `${environment.URI}/api/file/${id}`;

    return this.http
      .get<Files>(url)
      .pipe(map((resp: any) => resp.file));
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
}
