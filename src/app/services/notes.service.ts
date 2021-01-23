import { Injectable, Input, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UsersService } from "./users.service";
import { environment } from "../../environments/environment";
import { Observable, throwError, Subject } from "rxjs";
import { Note, NotesPagination } from "../models/Note";
import { map, catchError } from "rxjs/operators";
import { NotificationsService } from "./notifications.service";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: "root",
})
export class NotesService {
  constructor(
    private http: HttpClient,
    public _localStorageS: LocalStorageService,
    public _notificationsS: NotificationsService,
    private _usersS: UsersService
  ) {}

  private checkNotes = new Array<any>();
  private selectedNotes: any[] = [];
  caseId: string;
  noteSelected: any;
  tempCheckedNotes: any[] = [];

  public notificaNote = new EventEmitter<any>();

  private caseIdSub = new Subject<any>();
  private noteIdSub = new Subject<any>();
  private listedNotesSub = new Subject<any>();
  private selectedNotesSub = new Subject<any>();

  // Get checked notes after handler button clicked
  getShowingCheckedNotes(): any[] {
    return this.selectedNotes;
  }

  // Set checked notes after handler button clicked
  setShowingListedNotes(isInLocalStorage?: boolean) {
    this.setSelectedNotesSub(this.checkNotes);
    this.selectedNotes = this.checkNotes;
    if (!isInLocalStorage && this.checkNotes.length > 0) {
      this._localStorageS.addLocalStorageItem("notes", this.checkNotes);
    } else if (this.checkNotes.length === 0) {
      this._localStorageS.deleteLocalStorageProperty(["notes"]);
    }

    this.tempCheckedNotes = this.checkNotes;
  }

  // Get listed notes subscription
  getListedNotesSub(): Observable<any> {
    return this.listedNotesSub.asObservable();
  }

  // Set listed notes subscription
  setListedNotesSub(action: string, data: any) {
    action === "create"
      ? this.listedNotesSub.next({ action: action, data })
      : this.listedNotesSub.next({ action: action, data });
  }

  // Get checked/selected notes subscription
  getSelectedNotesSub(): Observable<any> {
    return this.selectedNotesSub.asObservable();
  }

  // Set checked/selected notes subscription
  setSelectedNotesSub(checkedNotes: any) {
    this.selectedNotesSub.next(checkedNotes);
  }

  // Get Checked Notes When Notes Component Its Called
  getCurrentCheckedNotes() {
    this.tempCheckedNotes = this.checkNotes;
  }

  // Update existing checked notes
  setCheckNotes(noteObteined: any, action: string) {
    if (action === "check") {
      this.checkNotes = [...this.checkNotes, noteObteined];
    } else {
      const tempSelectedNotes = this.checkNotes.filter((note) => {
        return note._id !== noteObteined._id;
      });
      this.checkNotes = tempSelectedNotes;
    }
  }

  // Add Checked Notes To Array From Local Storage
  setCheckNotesFromStorage(notesArrayObteined: any[]) {
    const tempNotesArrayObteined = notesArrayObteined.map(
      (evidenceObteined) => {
        return evidenceObteined;
      }
    );

    this.checkNotes = tempNotesArrayObteined;
  }

  getNoteIdSub(): Observable<any> {
    return this.noteIdSub.asObservable();
  }

  setNoteIdSub(key: string, idNote: any) {
    localStorage.setItem(key, idNote);
    this.noteIdSub.next(idNote);
  }

  getCaseIdSub(): Observable<any> {
    return this.caseIdSub.asObservable();
  }

  setCaseIdSub(modeV: string, key?: string, caseData?: any) {
    localStorage.setItem(key, JSON.stringify(caseData));
    this.caseIdSub.next({ modeV, caseId: caseData._id });
  }

  // Normal Functions

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
          return resp.note;
        })
      );
  }

  clearCheckNotes() {
    this.checkNotes = [];
    this.setShowingListedNotes();
  }

  clearNotListedNotes() {
    this.checkNotes = this.tempCheckedNotes;
  }

  createNote(idCase: string, note: any): Observable<any> {
    const url = `${environment.URI}/api/notes/${idCase}`;
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
    status: string = "PUBLIC"
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
        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
