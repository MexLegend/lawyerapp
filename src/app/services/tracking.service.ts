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
import { TrackingsPagination, Tracking } from "../models/Tracking";
import { UpdateDataService } from "./updateData.service";

import { saveAs } from "file-saver";
import { of } from "rxjs/internal/observable/of";

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

  disableCancelUpload: boolean = false;
  docs: any[] = [];
  public fileData: any = "";
  files: any[] = [];
  fileStorage: any;
  public notifica = new EventEmitter<any>();
  progressF: number = 0;
  progressT: number = 0;
  trackingStorage: any;

  getAll(id: string): Observable<Tracking[]> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/all/${id}`;

    return this.http
      .get<Tracking[]>(url, { headers })
      .pipe(map((resp: any) => resp.trackings));
  }

  getByLowyer(): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/lawyer/all`;

    return this.http.get(url, { headers }).pipe(map((resp: any) => resp.cases));
  }

  getTrackings(
    idFile: string,
    page: number = 0,
    perPage: number = 10,
    orderField: string = "",
    orderType: string = "",
    filter: string = "",
    filterOpt: string = "",
    status: string = "SENT"
  ): Observable<TrackingsPagination> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    let url = `${
      environment.URI
    }/api/trackings/${idFile}?status=${status}&page=${
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
    const url = `${environment.URI}/api/trackings/${id}`;

    return this.http
      .get<Tracking>(url, { headers })
      .pipe(map((resp: any) => {
        if(resp) {
          this._updateDataS.setItemTrack(
            "trackingData",
            JSON.stringify(resp.tracking)
          );
          this._updateDataS.setItemTracking("updating", true);
        }
        return resp.tracking
      }));
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

    if (localStorage.getItem("documents")) {
      console.log("DOCUMENTS---");
      for (let index = 0; index < this.files.length; index++) {
        data.append(
          "documents",
          this.files[index].data,
          this.files[index].data.name
        );
      }
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
          // this.files.splice(0, 1);

          if (resp.body) {
            console.log(resp.body);
            this._updateDataS.setItemTrack(
              "trackingData",
              JSON.stringify(resp.body.tracking)
            );
            this._updateDataS.setItemTracking("tracking", true);

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

  updateTracking(idTracking, status?: string) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    let data = new FormData();

    if (localStorage.getItem("comment")) {
      console.log("COMMENT---");
      data.append("comment", localStorage.getItem("comment"));
    }

    if (localStorage.getItem("documents")) {
      console.log("DOCUMENTS---");
      for (let index = 0; index < this.files.length; index++) {
        data.append(
          "documents",
          this.files[index].data,
          this.files[index].data.name
        );
      }
    }

    if (status) {
      console.log("STATUS---");
      data.append("status", status);
    }

    const url = `${environment.URI}/api/trackings/${idTracking}`;

    return this.http
      .put(url, data, { headers, reportProgress: true, observe: "events" })
      .pipe(
        map((resp: any) => {
          // this.files.splice(0, 1);

          if (resp.body && resp.body.tracking) {
            this._updateDataS.setItemTrack(
              "trackingData",
              JSON.stringify(resp.body.tracking)
            );
            this._updateDataS.setItemTracking("tracking", true);
          }
          //   console.log("UPDATED OKOKOKOKOKO!!!!");

          // this.reset();

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

  deleteTracking(idTracking: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/${idTracking}`;

    return this.http
      .delete(url, { headers, reportProgress: true, observe: "events" })
      .pipe(
        map((resp: any) => {
          console.log(resp);
          return resp;
        })
      );
  }

  deleteTrackingDoc(id: string, idDoc: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/trackings/${id}/doc/${idDoc}`;

    return this.http.delete(url, { headers }).pipe(
      map((resp: any) => {
        console.log(resp);
        return resp;
      })
    );
  }

  downloadPDF(url) {
    let headers = new HttpHeaders();
    headers = headers.set("Accept", "application/pdf");
    this.http
      .get(`http://${url}`, {
        headers: headers,
        responseType: "blob" as "blob",
      })
      .subscribe((response: any) => {
        console.log(response);
        var blob = new Blob([response]);
        var filename = url.split("uploads/")[1];
        saveAs(blob, filename);
      });
  }

  reset() {
    localStorage.removeItem("comment");
    localStorage.removeItem("documents");
    localStorage.removeItem("fileData");
    localStorage.removeItem("status");
    localStorage.removeItem("tracking");
    localStorage.removeItem("trackingData");
    localStorage.removeItem("updating");

    this.trackingStorage = false;
    this.fileStorage = false;
    this.fileData = null;
    this.files = [];
  }

  uploadDocs(idFile?, idTracking?) {
    console.log("SUBIR ARCHIVO");

    if (idFile !== null) {
      this.createTracking(idFile).subscribe((res: any) => {
        console.log(res);

        if (res) {
          // this.trackingStorage = true;
          this.progressUpload(res);
        }
      });
    } else {
      this.updateTracking(idTracking).subscribe((res: any) => {
        console.log(res);

        if (res) {
          // this.trackingStorage = true;
          this.progressUpload(res);
        }
      });
    }
  }

  progressUpload(res) {
    if (res.loaded && res.total) {
      this.progressT = Math.round(
        (Number(res.loaded) / Number(res.total)) * 100
      );
      this.progressF = Math.round(
        (Number(res.loaded) / Number(res.total)) * 100
      );
      console.log(Math.round((Number(res.loaded) / Number(res.total)) * 100));
    }

    if (res.body) {
      setTimeout(() => {
        this.disableCancelUpload = false;
        $("#modal-File-Upload").modal("close");
        this.files = [];
        this.progressT = 0;
        this.progressF = 0;
        localStorage.removeItem("documents");
      }, 2000);
    }
  }
}
