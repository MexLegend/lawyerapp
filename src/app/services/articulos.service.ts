import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Articulo, ArticulosPaginacion } from '../models/Articulo';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  constructor(
    private http: HttpClient,
    private _usuariosS: UsuariosService
  ) { }

  crear(articulo: Articulo): Observable<Articulo> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usuariosS.token
    });


    const url = `${environment.URI}/api/posts`;

    return this.http.post<Articulo>(url, articulo, { headers }).pipe(
      map((resp: any) => {
        // this._notificacionS.crear(`Carrera ${resp.carrera.nombre} actualizado`, 'Cerrar', 3000);
        console.log(resp);
        return resp;
      })
    );
  }

  obtener(
    page: number = 0,
    perPage: number = 10,
    orderField: string = '',
    orderType: string = '',
    filter: string = '',
    filterOpt: string = 'title',
    status: boolean = true
  ): Observable<ArticulosPaginacion> {

    let url = `${environment.URI}/api/posts?status=${status}&page=${page +
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
}
