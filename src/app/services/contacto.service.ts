import { Injectable } from '@angular/core';
import { Contacto } from '../models/Contacto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(
    private http: HttpClient,
    public _notificacionS: NotificationService
  ) { }

  enviarEmail(contacto: Contacto): Observable<Contacto> {
    

    const url = `${environment.URI}/api/email`;
    
    return this.http.post<Contacto>(url, contacto).pipe(
      map((resp: any) => {
        this._notificacionS.mensaje('success', 'Mensaje enviado con éxito', 'El mensaje se envió correctamente', false, false, '', '', 2000)
        return resp;
      })
    );
  }
}
