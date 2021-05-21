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
import { MatDialogRef } from "@angular/material";

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

  enviarEmail(
    contact: Contact,
    action: string,
    modalRef?: MatDialogRef<any>,
    isResended?: boolean
  ): Observable<Contact> {
    const url = `${environment.URI}/api/email`;

    const link = () => {
      switch (action) {
        case "confirmNewsLetter":
          return `${location.origin}/#/newsletter/confirmed`;
        case "newsLetterConfirmed":
          return `${location.origin}/#/emails/confirmed`;
        case "recoverAccount":
          return `${location.origin}/#/account/change-pass`;
        default:
          return `${location.origin}/#/account/confirmed`;
      }
    };

    const data = {
      ...contact,
      action,
      link: link(),
    };

    return this.http.post<Contact>(url, data).pipe(
      map((resp: any) => {
        if (modalRef) modalRef.close();

        const emailSuccessTitle = () => {
          switch (action) {
            case "caseEvaluation":
              return {
                title: "Tu solicitud fue enviada correctamente",
                subtitle: "",
              };
            case "lawyerContact":
              return {
                title: "Tu solicitud fue enviada correctamente",
                subtitle: "",
              };

            default:
              return {
                title: "Confirma tu suscripción",
                subtitle: `Se ha enviado un mensaje de verificación al correo ${contact.emailSender}`,
              };
          }
        };
        if (
          action !== "newsLetterConfirmed" &&
          action !== "recoverAccount" &&
          !isResended
        )
          this._notificacionsS.message(
            "success",
            emailSuccessTitle().title,
            emailSuccessTitle().subtitle,
            false,
            ["confirmNewsLetter", "confirmAccount"].indexOf(action) === -1
              ? false
              : true,
            ["confirmNewsLetter", "confirmAccount"].indexOf(action) === -1
              ? ""
              : "Ok",
            "",
            ["confirmNewsLetter", "confirmAccount"].indexOf(action) === -1
              ? 2000
              : null
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

  subscribeToNewsLetter(contact: Contact, action: string): Observable<Contact> {
    const url = `${environment.URI}/api/email/newsLetter/subscription`;

    return this.http.post<Contact>(url, contact).pipe(
      map((resp: any) => {
        if (resp.ok) {
          const emailSub = this.enviarEmail(
            { ...contact, id: resp.newsLetter._id },
            action
          ).subscribe((resp: any) => {
            if (resp.ok) emailSub.unsubscribe();
          });
        } else
          this._notificacionsS.message(
            "error",
            "Oops...",
            "",
            false,
            true,
            "Aceptar",
            "",
            null,
            `El correo <b>${contact.emailSender}</b> ya está suscrito a nuestro boletín. Ingresa un correo distinto.`
          );

        return resp;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
