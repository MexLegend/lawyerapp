import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Whatsapp } from '../models/Whatsapp';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor(
    private http: HttpClient
  ) { }

  sendMessage(message: Whatsapp): Observable<Whatsapp> {

    const url = `${ environment.URI }/api/whatsapp`;

    return this.http.post<Whatsapp>(url, message).pipe(
      map((resp: any) => {
        // this._notificacionS.crear(`Carrera ${resp.carrera.nombre} actualizado`, 'Cerrar', 3000);
        return resp;
      })
    );
  }
}