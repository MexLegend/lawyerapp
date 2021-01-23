import {
  HttpClient,
  HttpHeaders,
  HttpEventType,
  HttpErrorResponse,
} from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { NotificationsService } from "./notifications.service";
import { UsersService } from "./users.service";
import { Subject } from 'rxjs/internal/Subject';

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class VolumesService {
  constructor(
    private http?: HttpClient,
    public _notificationsS?: NotificationsService,
    private _usersS?: UsersService
  ) {}

  private volumeSub = new Subject<any>();

  watchVolumeSub(): Observable<any> {
    return this.volumeSub.asObservable();
  }

  setVolumeSub(key: string, volume?: any) {
    localStorage.setItem(key, volume);
    this.volumeSub.next(volume);
  }

  getAll(idCase: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/volumes/all/${idCase}`;

    return this.http
      .get(url, { headers })
      .pipe(map((resp: any) => resp.volumes));
  }

  getVolume(id: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/volumes/${id}`;

    return this.http
      .get<any>(url, { headers })
      .pipe(
        map((resp: any) => {
          return resp.volume;
        })
      );
  }

  createTracking(idFile, status?: any) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    let data = new FormData();
    if (localStorage.getItem("comment")) {
      console.log("COMMENT---");
      data.append("comment", localStorage.getItem("comment"));
    }

    if (status) {
      console.log("STATUS---");
      data.append("status", status);
    }

    const url = `${environment.URI}/api/trackings/${idFile}`;

    return this.http
      .post(url, data, { headers, reportProgress: true, observe: "events" })
      .pipe(
        map((resp: any) => {
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
}
