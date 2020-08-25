import { Injectable, Input, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsersService } from './users.service';
import { environment } from '../../environments/environment';
import { Observable, throwError, Subject } from 'rxjs';
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
  noteSelected: any;
  notesSlc: any[] = [];
  public notificaNote = new EventEmitter<any>();

  private noteSub = new Subject<any>();
  private caseIdSub = new Subject<any>();
  watchNoteSub(): Observable<any> {
    return this.noteSub.asObservable();
  }

  setNoteSub(key: string, note?: any) {
    localStorage.setItem(key, JSON.stringify(this.notesSlc));
    this.noteSub.next(note);
  }

  getCaseIdSub(): Observable<any> {
    return this.caseIdSub.asObservable();
  }

  setCaseIdSub(modeV: string, caseId: string) {
    this.caseIdSub.next({modeV, caseId});
  }

  changeStatusNote(
    idCase: string,
    idNote: string,
    statusN: string
  ): Observable<Note> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/notes/status/${idCase}/${idNote}`;

    const data =
      statusN === "DELETED"
        ? {
            deleted: "DELETED",
          }
        : {
            status: statusN,
          };

    return this.http
      .put<Note>(url, data, { headers })
      .pipe(
        map((resp: any) => {
          this._notificationsS.message(
            "success",
            `${resp.deleted ? "Eliminación correcta" : "Estado actualizado"}`,
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

  createNote(note: any): Observable<any> {
    const url = `${environment.URI}/api/notes/${this.caseId}`;
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });

    return this.http
      .post<Note>(url, note, { headers })
      .pipe(
        map((resp: any) => {
          this._notificationsS.message(
            "success",
            "Nota creada correctamente",
            false,
            false,
            false,
            "",
            "",
            2000
          );
          return resp;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  deleteListedNote(idNote: string) {
    const notesN = JSON.parse(localStorage.getItem("notes")).filter((noteS) => {
      return noteS._id !== idNote;
    });

    return notesN;
  }

  deleteNote(idCase: string, idNote: string): Observable<Note> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      token: this._usersS.token,
    });
    const url = `${environment.URI}/api/notes/temp/${idCase}/${idNote}`;

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
    let url = `${
      environment.URI
    }/api/notes/all/${caseId}?status=${status}&page=${
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

  updateNote(idCase, note: any) {
    const headers = new HttpHeaders({
      token: this._usersS.token,
    });
    const noteU = {
      affair: note.noteAffair,
      message: note.noteMessage,
      status: note.noteStatus,
      _id: note._id,
    };
    const url = `${environment.URI}/api/notes/${idCase}/${note._id}`;

    return this.http.put(url, noteU, { headers }).pipe(
      map((resp: any) => {
        this._notificationsS.message(
          "success",
          "Nota editada correctamente",
          false,
          false,
          false,
          "",
          "",
          2000
        );
        return true;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
