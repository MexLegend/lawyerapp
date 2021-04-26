import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Contact } from "../models/Contact";
import { NotificationsService } from "./notifications.service";
import { User } from "../models/User";
import { MatDialog } from "@angular/material/dialog";
import { ReplyComponent } from "../modals/reply/reply.component";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public _notificacionsS: NotificationsService
  ) {}

  contactsList = new Subject<any>();

  enviarEmail(contact: Contact, action: string): Observable<Contact> {
    const url = `${environment.URI}/api/email`;

    const data = {
      ...contact,
      action,
    };

    return this.http.post<Contact>(url, data).pipe(
      map((resp: any) => {
        const emailSuccessTitle = () => {
          switch (action) {
            case "caseEvaluation":
              return "Tu solicitud fue enviada correctamente";
            case "lawyerContact":
              return "Tu mensaje fue enviado correctamente";

            default:
              return "Suscripción exitosa";
          }
        };

        this._notificacionsS.message(
          "success",
          emailSuccessTitle(),
          "",
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

  createContact(idUser: string, idContact: string) {
    const url = `${environment.URI}/api/contacts`;

    const data = {
      idUser,
      idContact,
    };

    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getContacts(idUser: string) {
    const url = `${environment.URI}/api/contacts/${idUser}`;

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.setContactsList(
          resp.userContacts[0] ? resp.userContacts[0].contacts : []
        );
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getContactsList(): Observable<User[]> {
    return this.contactsList.asObservable();
  }

  // Open Email Contact Modal
  openReplyModal(user?: any) {
    let dialogRef = this.dialog.open(ReplyComponent, {
      data: { user, action: "Nuevo" },
      autoFocus: false,
    });
  }

  setContactsList(contactsList: User[]) {
    this.contactsList.next(contactsList);
  }
}
