import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { NotificationsService } from "./notifications.service";
import { UsersService } from "./users.service";
import { TrackingsPagination, Tracking } from "../models/Tracking";
import { UpdateDataService } from "./updateData.service";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class TrackingService {
  constructor(
    private http?: HttpClient,
    public _notificationsS?: NotificationsService,
    public _updateDataS?: UpdateDataService,
    private _usersS?: UsersService
  ) {}

  files: any[] = [];
  public notifica = new EventEmitter<any>();

  getAll(id: string): Observable<Tracking[]> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/tracking/all/${id}`;

    return this.http
      .get<Tracking[]>(url, { headers })
      .pipe(map((resp: any) => resp.trackings));
  }

  getTrackings(
    idFile: string,
    page: number = 0,
    perPage: number = 10,
    orderField: string = "",
    orderType: string = "",
    filter: string = "",
    filterOpt: string = "",
    status: string = "OPEN"
  ): Observable<TrackingsPagination> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    let url = `${
      environment.URI
    }/api/tracking/${idFile}?status=${status}&page=${
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
      .get<TrackingsPagination>(url, { headers })
      .pipe(map((resp: any) => resp.trackings));
  }

  getTracking(id: string): Observable<Tracking> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/tracking/${id}`;

    return this.http
      .get<Tracking>(url, { headers })
      .pipe(map((resp: any) => resp.tracking));
  }

  createTracking(id, file: any) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    console.log(file);
    console.log(file.length);
    console.log(typeof file)
    let data = new FormData();
    if (file.comment) {
        console.log("COMMENT---");
      data.append("comment", file.comment);
    } else if (file.length >= 1 && file.length !== undefined && typeof file === 'object') {
        console.log("FILES---");
        for (let index = 0; index < file.length; index++) {
        data.append("files", file[index].data, file[index].data.name);
        }
    } else if (file === "CLOSED" || file === "OPEN") {
        console.log("STATUS---");
        data.append("status", file);
    }

    const url = `${environment.URI}/api/tracking/${id}`;

    return this.http
      .post(url, data, { headers, reportProgress: true, observe: "events" })
      .pipe(
        map((resp: any) => {
          this.files.splice(0, 1);

          if (resp.body) {

            this._updateDataS.setItemTrack(
              "trackingData",
              JSON.stringify(resp.body.tracking)
            );

            console.log("CREATED OKOKOKOKOKO!!!!");

          }
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

  updateTracking(id, file: any) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    let data = new FormData();
    if (file.comment) {
      data.append("comment", file.comment);
    } else if (this.files.length >= 1 && this.files[0].data.name) {
      for (let index = 0; index < file.length; index++) {
        data.append("files", file[index].data, file[index].data.name);
      }
    }
    if (localStorage.getItem("tracking")) {
      data.append("tracking", JSON.parse(localStorage.getItem("tracking")));
    }
    const url = `${environment.URI}/api/tracking/${id}`;

    return this.http
      .put(url, data, { headers, reportProgress: true, observe: "events" })
      .pipe(
        map((resp: any) => {
          this.files.splice(0, 1);

          if (resp.body) {
            console.log("UPDATED OKOKOKOKOKO!!!!");

            this._updateDataS.setItemTrack(
              "trackingData",
              JSON.stringify(resp.body.tracking)
            );

          }
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

  deleteTracking(id: string): Observable<Tracking> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/tracking/${id}`;

    return this.http
      .delete<Tracking>(url, { headers })
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
