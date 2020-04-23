import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Contact } from '../models/Contact';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient,
    public _notificacionsS: NotificationsService
  ) { }

  enviarEmail(contact: Contact): Observable<Contact> {
    

    const url = `${ environment.URI }/api/email`;
    
    return this.http.post<Contact>(url, contact).pipe(
      map((resp: any) => {
        this._notificacionsS.message('success', 'Mensaje enviado con éxito', 'El mensaje se envió correctamente', false, false, '', '', 2000)
        return resp;
      })
    );
  }
}
