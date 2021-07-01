import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Observable, throwError, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material";

@Injectable({
  providedIn: "root",
})
export class RatingService {
  constructor(public dialog: MatDialog, private http: HttpClient) {}

  private ratingData = new Subject<any>();
  private reloadedRatingData = new Subject<[any, string]>();

  // Get Rating Data
  getRatingData(): Observable<any> {
    return this.ratingData.asObservable();
  }

  // Get Reloaded Rating Data
  getReloadedRatingData(): Observable<[any, string]> {
    return this.reloadedRatingData.asObservable();
  }

  // Get Rating Data Of All Users
  getAllRatingDataFromDataBase(id: string): Observable<any> {
    const url = `${environment.URI}/api/utilities/rate/all/${id}`;

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  // Get Rating Data Of One User
  getOneRatingDataFromDataBase(id: string, user: string): Observable<any> {
    const url = `${environment.URI}/api/utilities/rate/one/${id}/${user}`;

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  // Return True / False If Data Is Rated
  isDataRated(dataList: any, ratingsList: any): any {
    return dataList.map((dataItem) => {
      const i = ratingsList.findIndex(
        (ratingItem) => dataItem._id === ratingItem.data_id
      );
      if (i > -1)
        return {
          ...dataItem,
          isRated: true,
          ratingData: ratingsList[i],
        };
      else return { ...dataItem, isRated: false };
    });
  }

  // Set Rating Data
  setRatingData(ratingData: any) {
    this.ratingData.next(ratingData);
  }

  // Rate Data
  rateData(data: Object, token: any): Observable<any> {
    const headers = new HttpHeaders({ token });

    const url = `${environment.URI}/api/utilities/rate`;

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  // Reload Rating Data
  reloadRatingData(dataList: any, dataType: string) {
    this.reloadedRatingData.next([dataList, dataType]);
  }

  // Update Rated Data
  updateRatedData(data: Object, token: any): Observable<any> {
    const headers = new HttpHeaders({ token });

    const url = `${environment.URI}/api/utilities/rate/update`;

    return this.http.put(url, data, { headers }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
