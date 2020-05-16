import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post, PostsPagination } from '../models/Post';
import { NotificationsService } from './notifications.service';
import { UsersService } from './users.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  public notifica = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    public _notificationsS: NotificationsService,
    private _usersS: UsersService
  ) { }

  createPost(post: any, img?: any): Observable<any> {
    const url = `${ environment.URI }/api/posts`;
    const headers = new HttpHeaders({
      token: this._usersS.token
    });

    const data = {
      post,
      img
    }

    return this.http.post<Post>(url, data, { headers }).pipe(
      map((resp: any) => {
        $("#modal-Articulo").modal("close");
        this._notificationsS.message('success', 'Creación correcta', resp.message, false, false, '', '', 2000);
        return resp;
      }),
      catchError(err => {
        $("#modal-Articulo").modal("close");
        this._notificationsS.message('error', 'Creación fallida', err.message, false, false, '', '', 2000);
        return throwError(err);
      })
    );
  }

  deletePost(id: string): Observable<Post> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usersS.token
    })
    const url = `${ environment.URI }/api/posts/${ id }`;

    return this.http.delete<Post>(url, { headers }).pipe(map((resp: any) => {
      this._notificationsS.message('success', 'Eliminación correcta', resp.message, false, false, '', '', 2000);
      return resp;
    }));
  }

  getPost(id: string): Observable<Post> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this._usersS.token
    })
    const url = `${ environment.URI }/api/posts/${ id }`;

    return this.http.get<Post>(url, { headers }).pipe(map((resp: any) => resp.post));
  }

  getPosts(
    page: number = 0,
    perPage: number = 10,
    orderField: string = '',
    orderType: number = 0,
    filter: string = '',
    filterOpt: string = 'title',
    status: boolean = true
  ): Observable<PostsPagination> {

    let url = `${  environment.URI  }/api/posts?status=${ status}&page=${ page +
      1}&perPage=${ perPage }`;

    if (orderField && orderType) {
      url = `${ url }&orderField=${ orderField}&orderType=${ orderType }`;
    }

    if (filterOpt) {
      url = `${ url }&filterOpt=${ filterOpt }`;
    }

    if (filter) {
      url = `${ url }&filter=${ filter }`;
    }

    return this.http
      .get<PostsPagination>(url)
      .pipe(map((resp: any) => resp.posts));
  }

  updatePost(id, post: any, img?: any) {
    const headers = new HttpHeaders({
      token: this._usersS.token
    })
    const url = `${  environment.URI  }/api/posts/${ id }`;

    const data = {
      post,
      img
    }

    return this.http.put(url, data, { headers }).pipe(map((resp: any) => {
      $("#modal-Articulo").modal("close");
      this._notificationsS.message('success', 'Actualización correcta', resp.message, false, false, '', '', 2000);
      return true;
    }),
      catchError(err => {
        $("#modal-Articulo").modal("close");
        this._notificationsS.message('error', 'Actualización fallida', err.message, false, false, '', '', 2000);
        return throwError(err);
      })
    );
  }
}