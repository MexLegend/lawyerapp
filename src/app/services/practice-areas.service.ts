import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { NotificationsService } from "./notifications.service";
import { PracticeArea, PracticeAreaPagination } from "../models/PracticeArea";
import { UsersService } from "./users.service";

@Injectable({
  providedIn: "root",
})
export class PracticeAreasService {
  constructor(
    private http: HttpClient,
    public _notificationsS: NotificationsService,
    private _usersS: UsersService
  ) {}

  FAQsList = new Subject<[Array<any>, string]>();
  practiceAreasList = new Subject<[Array<PracticeArea>, string]>();
  referencesList = new Subject<[Array<any>, string]>();

  createPracticeArea(
    author: any,
    practiceAreaData: any,
    lawyersList?: any
  ): Observable<any> {
    const url = `${environment.URI}/api/practice-areas`;
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    const data = {
      author,
      practiceAreaData,
      lawyersList,
    };

    return this.http
      .post<PracticeArea>(url, data, { headers })
      .pipe(
        map((resp: any) => {
          this.setPracticeAreasList([resp.practiceArea], "push");

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

  deletePracticeAreaCompletly(id: string): Observable<PracticeArea> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/practice-areas/completly/${id}`;

    return this.http
      .delete<PracticeArea>(url, { headers })
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

  deleteSpecializedLawyer(
    idPracticeArea: string,
    lawyers: any
  ): Observable<PracticeArea> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/practice-areas/specialized-lawyer/${idPracticeArea}`;

    const data = { lawyers };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        console.log("Eliminación correcta ", resp.message);
        return resp;
      })
    );
  }

  deletePracticeAreaTemporary(id: string): Observable<PracticeArea> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/practice-areas/temporary/${id}`;

    return this.http
      .delete<PracticeArea>(url, { headers })
      .pipe(
        map((resp: any) => {
          this.setPracticeAreasList([resp.practiceArea], "delete");

          this._notificationsS.message(
            "success",
            "Eliminación correcta",
            resp.message,
            false,
            true,
            "OK",
            "",
            null
          );
          return resp;
        }),
        catchError((err) => {
          this._notificationsS.message(
            "error",
            "Eliminación fallida",
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

  getSpecializedLawyers(id: string): Observable<any> {
    const url = `${environment.URI}/api/practice-areas/specialized-lawyers/${id}`;
    return this.http
      .get<PracticeArea>(url)
      .pipe(map((resp: any) => resp.specializedLawyers));
  }

  getFAQsList(): Observable<[Array<any>, string]> {
    return this.FAQsList.asObservable();
  }

  setFAQsList(faqs: any, action: string) {
    this.FAQsList.next([faqs, action]);
  }

  getPracticeArea(id: string): Observable<PracticeArea> {
    const url = `${environment.URI}/api/practice-areas/${id}`;
    return this.http
      .get<PracticeArea>(url)
      .pipe(map((resp: any) => resp.practiceArea));
  }

  getPracticeAreas(
    processState: string = "REVIEWING",
    is_category: boolean = false,
    page: number = 0,
    perPage: number = 10,
    orderField: string = "",
    orderType: number = 0,
    status: boolean = true
  ): Observable<any> {
    let url = `${environment.URI}/api/practice-areas/?status=${status}&page=${
      page + 1
    }&perPage=${perPage}&is_category=${is_category}`;

    if (orderField && orderType) {
      url = `${url}&orderField=${orderField}&orderType=${orderType}`;
    }

    if (processState) {
      url = `${url}&processState=${processState}`;
    }

    return this.http
      .get<PracticeAreaPagination>(url)
      .pipe(
        map((resp: any) =>
          this.setPracticeAreasList(resp.practiceAreas, "list")
        )
      );
  }

  getPracticeAreasList(): Observable<[Array<PracticeArea>, string]> {
    return this.practiceAreasList.asObservable();
  }

  setPracticeAreasList(practiceArea: any, action: string) {
    this.practiceAreasList.next([practiceArea, action]);
    localStorage.setItem("practiceAreas", JSON.stringify(practiceArea));
  }

  getReferencesList(): Observable<[Array<any>, string]> {
    return this.referencesList.asObservable();
  }

  setReferencesList(references: any, action: string) {
    this.referencesList.next([references, action]);
  }

  updatePracticeArea(
    author: any,
    id: string,
    practiceAreaData: any,
    lawyersList?: any
  ) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/practice-areas/${id}`;

    const data = {
      author,
      practiceAreaData,
      lawyersList,
    };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        this.setPracticeAreasList([resp.practiceArea], "update");

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

  updatePracticeAreaState(id: string, processState: string) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/practice-areas/updateStatus/${id}`;

    const data = { processState };

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        this.setPracticeAreasList([resp.practiceArea], "update");

        this._notificationsS.message(
          "success",
          resp.message,
          "",
          false,
          false,
          "",
          "",
          2000
        );
        return resp.post;
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

  // Go to Area Detail Section
  goToAreaDetail(
    router: any,
    id: string,
    practiceAreasList: Array<PracticeArea>
  ): void {
    router.navigate([`/area-detalle/${id}`]);
    this.setPracticeAreasList(practiceAreasList, "list");
  }
}
