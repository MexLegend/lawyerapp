import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Files, FilesPagination } from '../models/Files';
import { NotificationsService } from './notifications.service';
import { UsersService } from './users.service';

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class FilesService {
  public notifica = new EventEmitter<any>();
  files: any[] = [];
  constructor(
    private http?: HttpClient,
    public _notificationsS?: NotificationsService,
    private _usersS?: UsersService
  ) {}

  getAll(id: string): Observable<Files[]> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/files/all/${id}`;

    return this.http
      .get<Files[]>(url, { headers })
      .pipe(map((resp: any) => resp.files));
  }

  getFiles(
    page: number = 0,
    perPage: number = 10,
    orderField: string = "",
    orderType: string = "",
    filter: string = "",
    filterOpt: string = "affair",
    status: boolean = true
  ): Observable<FilesPagination> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    let url = `${environment.URI}/api/files?status=${status}&page=${
      page + 1
    }&perPage=${perPage}`;

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
      .get<FilesPagination>(url, { headers })
      .pipe(map((resp: any) => resp.files));
  }

  getFile(id: string): Observable<Files> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/files/${id}`;

    return this.http
      .get<Files>(url, { headers })
      .pipe(map((resp: any) => resp.file));
  }

  createFile(file: Files): Observable<Files> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    const url = `${environment.URI}/api/files`;

    return this.http
      .post<Files>(url, file, { headers })
      .pipe(
        map((resp: any) => {


            console.log("grtgrtgrtgrt");
            $("#modal-Expediente").modal("close");
            this._notificationsS.message(
              "success",
              "Creación correcta",
              resp.message,
              false,
              false,
              "",
              "",
              2000
            );

          return resp;
        }),
        catchError((err) => {
          $("#modal-Expediente").modal("close");
          this._notificationsS.message(
            "error",
            "Creación fallida",
            err.message,
            false,
            false,
            "",
            "",
            2000
          );
          return throwError(err);
        })
      );
  }

  updateFile(id, file: Files) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token
    });
    console.log(file);
    
    const url = `${environment.URI}/api/files/${id}`;

    return this.http
      .put(url, file, { headers })
      .pipe(
        map((resp: any) => {
          console.log(resp);
          $("#modal-Expediente").modal("close");
          this._notificationsS.message(
            "success",
            "Actualización correcta",
            resp.message,
            false,
            false,
            "",
            "",
            2000
          );
          return resp;
        }),
        catchError((err) => {
          $("#modal-Expediente").modal("close");
          this._notificationsS.message(
            "error",
            "Actualización fallida",
            err.message,
            false,
            false,
            "",
            "",
            2000
          );
          return throwError(err);
        })
      );
  }

  deleteFile(id: string): Observable<Files> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/files/${id}`;

    return this.http
      .delete<Files>(url, { headers })
      .pipe(
        map((resp: any) => {
          this._notificationsS.message(
            "success",
            "Eliminación correcta",
            resp.message,
            false,
            false,
            "",
            "",
            2000
          );
          return resp;
        })
      );
  }
}
