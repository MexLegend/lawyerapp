import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Contact } from "../models/Contact";
import { NotificationsService } from "./notifications.service";
import { User } from "../models/User";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  constructor(
    private http: HttpClient,
    public _notificacionsS: NotificationsService
  ) {}

  contactsList = new Subject<any>();

  enviarEmail(contact: Contact): Observable<Contact> {
    const url = `${environment.URI}/api/email`;

    return this.http.post<Contact>(url, contact).pipe(
      map((resp: any) => {
        this._notificacionsS.message(
          "success",
          "Mensaje enviado con éxito",
          "El mensaje se envió correctamente",
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

  setContactsList(contactsList: User[]) {
    this.contactsList.next(contactsList);
  }
}
