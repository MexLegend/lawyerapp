import { Injectable } from '@angular/core';
import { Contacto } from '../models/Contacto';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Whatsapp } from '../models/Whatsapp';

@Injectable({
  providedIn: 'root'
})
export class WebPushNotificationService {

  constructor(
    private http: HttpClient
  ) { }

  postSubscription(sub: PushSubscription) {
    console.log(sub);

    const url = `${environment.URI}/api/usuarios/subscribe`;
    
    return this.http.post(url, sub).pipe(
        catchError(this.handleError)
    );
  }

  handleError(error) {
      return throwError(error.error.message)
  }
}
