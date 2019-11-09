import { Injectable } from '@angular/core';
import { Contacto } from '../models/Contacto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(
    private http: HttpClient
  ) { }

  enviarEmail(contacto: Contacto): Observable<Contacto> {
    

    const url = `${environment.URI}/email`;
    
    return this.http.post<Contacto>(url, contacto).pipe(
      map((resp: any) => {
        // this._notificacionS.crear(`Carrera ${resp.carrera.nombre} actualizado`, 'Cerrar', 3000);
        console.log(resp);
        return resp;
      })
    );
  }
}
