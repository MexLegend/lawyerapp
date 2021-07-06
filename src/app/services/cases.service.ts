import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Cases, CasesPagination } from "../models/Cases";
import { NotificationsService } from "./notifications.service";
import { UsersService } from "./users.service";

@Injectable({
  providedIn: "root",
})
export class CasesService {
  constructor(
    private http?: HttpClient,
    public _notificationsS?: NotificationsService,
    private _usersS?: UsersService
  ) {}

  public notifica = new EventEmitter<any>();
  files: any[] = [];

  private casesData = new Subject<Cases[]>();
  private isCaseArchived = new Subject<boolean>();
  private selectedClientData = new Subject<any>();

  // Observable Functions

  createFile(file: Cases): Observable<Cases> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    const url = `${environment.URI}/api/cases`;

    return this.http.post<Cases>(url, file, { headers }).pipe(
      map((resp: any) => {
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

  deleteFile(id: string): Observable<Cases> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    const url = `${environment.URI}/api/cases/temp/${id}`;

    return this.http.delete<Cases>(url, { headers }).pipe(
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

  getAll(id: string): Observable<Cases[]> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/cases/all/${id}`;

    return this.http
      .get<Cases[]>(url, { headers })
      .pipe(map((resp: any) => resp.files));
  }

  getCasesData(): Observable<any> {
    return this.casesData.asObservable();
  }

  setCasesData(casesData: Cases[]) {
    this.casesData.next(casesData);
  }

  getCases(page: number = 0, perPage: number = 10, status: string = "") {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });

    let url = `${environment.URI}/api/cases?status=${status}&page=${
      page + 1
    }&perPage=${perPage}`;

    return this.http
      .get<CasesPagination>(url, { headers })
      .pipe(map((resp: any) => this.setCasesData(resp.cases)));
  }

  getFile(id: string): Observable<Cases> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/cases/${id}`;

    return this.http
      .get<Cases>(url, { headers })
      .pipe(map((resp: any) => resp.case));
  }

  getIsCaseArchived(): Observable<boolean> {
    return this.isCaseArchived.asObservable();
  }

  setIsCaseArchived(isArchived: boolean) {
    this.isCaseArchived.next(isArchived);
  }

  getSelectedClientData(): Observable<any> {
    return this.selectedClientData.asObservable();
  }

  setSelectedClientData(selectedClient: any) {
    this.selectedClientData.next(selectedClient);
  }

  // Normal Functions

  async getCasesCount(
    casesArray: Cases[],
    initialCasesCount: any
  ): Promise<any> {
    let casesCount: any;

    casesArray.map((caseItem: Cases) => {
      switch (caseItem.status) {
        case "ACTIVE":
          casesCount = {
            ...initialCasesCount,
            active: (initialCasesCount.active += 1),
          };
          break;
        default:
          casesCount = {
            ...initialCasesCount,
            archived: (initialCasesCount.archived += 1),
          };
          break;
      }
    });

    return new Promise((resolve, reject) => resolve(casesCount));
  }

  updateFile(id, file: any) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/cases/${id}`;

    return this.http.put(url, file, { headers }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
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

  updateCaseStatus(id: string, status: any) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/cases/${id}`;
    const data = { status };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
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
