import { Injectable } from '@angular/core';
import { Contacto } from '../models/Contacto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Whatsapp } from '../models/Whatsapp';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor(
    private http: HttpClient
  ) { }

  enviarMensaje(message: Whatsapp): Observable<Whatsapp> {
    console.log(message);
    

    const url = `${environment.URI}/api/whatsapp`;
    
    return this.http.post<Whatsapp>(url, message).pipe(
      map((resp: any) => {
        // this._notificacionS.crear(`Carrera ${resp.carrera.nombre} actualizado`, 'Cerrar', 3000);
        console.log(resp);
        return resp;
      })
    );
  }
}
