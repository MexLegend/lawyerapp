import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsersService } from './users.service';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Note, NotesPagination } from '../models/Note';
import { map, catchError } from 'rxjs/operators';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: "root",
})
export class NotesService {
  constructor(
    private http: HttpClient,
    public _notificationsS: NotificationsService,
    private _usersS: UsersService
  ) {}

  caseId: string;

  createNote(note: any): Observable<any> {
    console.log(note)
    const url = `${environment.URI}/api/notes/${ this.caseId }`;
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    return this.http
      .post<Note>(url, note, { headers })
      .pipe(
        map((resp: any) => {
          
          return resp;
        }),
        catchError((err) => {
          
          return throwError(err);
        })
      );
  }

  deleteNote(id: string): Observable<Note> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/notes/${id}`;

    return this.http
      .delete<Note>(url, { headers })
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

  getNote(id: string): Observable<Note> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/notes/${id}`;

    return this.http
      .get<Note>(url, { headers })
      .pipe(map((resp: any) => resp.note));
  }

  getNotes(
    caseId: string,
    page: number = 0,
    perPage: number = 10,
    orderField?: string,
    orderType?: number,
    filter?: string,
    filterOpt?: string,
    status?: string
  ): Observable<NotesPagination> {
    let url = `${environment.URI}/api/notes/all/${ caseId }?status=${status}&page=${
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
      .get<NotesPagination>(url)
      .pipe(map((resp: any) => resp.notes));
  }

  updateNote(id, note: any) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/notes/${id}`;


    return this.http.put(url, note, { headers }).pipe(
      map((resp: any) => {
        
        return true;
      }),
      catchError((err) => {
        
        return throwError(err);
      })
    );
  }
}
